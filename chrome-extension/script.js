document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const chatbotContainer = document.getElementById("chatbot-container");
  const chatToggleButton = document.getElementById("chat-toggle-button");
  const chatCard = document.getElementById("chat-card");
  const closeChatButton = document.getElementById("close-chat-button");
  const messagesContainer = document.getElementById("messages-container");
  const chatForm = document.getElementById("chat-form");
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-button");

  // Welcome messages
  const welcomeMessages = [
    "I am Aletheia, the Goddess of Truth. What would you like me to debug for you?",
    "Greetings, seeker of truth! I am Aletheia. How can I assist in finding the flaw?",
    "Welcome! I am Aletheia, here to unveil the truth. What needs debugging?",
    "I am Aletheia, the one who reveals truth. Tell me what troubles your code.",
    "The truth shall be revealed! I, Aletheia, will help you debug. What is the issue?",
  ];

  // Initialize the Gemini model
  const API_KEY = "AIzaSyDZWZijo60xAMZOiU4Zs-2M0uWGaX9Sdcs"; // Note: Exposing API keys in client-side code is not recommended for production
  let genAI;
  let model;

  // State
  let messages = [];
  let conversationHistory = [];

  // Initialize Google Generative AI
  async function initializeGeminiAPI() {
    try {
      // Explicitly declare the google variable or import it
      if (typeof google === "undefined" || !google.generativeai) {
        console.error(
          "Google Generative AI library is not loaded. Ensure it's included in your HTML."
        );
        return;
      }

      genAI = new google.generativeai.GenerativeModel({
        apiKey: API_KEY,
        model: "gemini-2.0-flash",
      });
      model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      console.log("Gemini API initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Gemini API:", error);
    }
  }

  // Show chatbot with animation after a delay
  setTimeout(() => {
    chatbotContainer.classList.remove("hidden");
    chatbotContainer.classList.add("animate-fadeInUp");

    // Initialize Gemini API
    initializeGeminiAPI();

    // Open chat and show welcome message after another delay
    setTimeout(() => {
      openChat();
      const randomWelcome =
        welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
      addBotMessage("");
      typeText(randomWelcome, 0, "bot");
    }, 2000);
  }, 500);

  // Event Listeners
  chatToggleButton.addEventListener("click", openChat);
  closeChatButton.addEventListener("click", closeChat);

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (!message) return;

    sendMessage(message);
  });

  messageInput.addEventListener("input", () => {
    sendButton.disabled = !messageInput.value.trim();
  });

  // Functions
  function openChat() {
    chatToggleButton.classList.add("hidden");
    chatCard.classList.remove("hidden");
    chatCard.classList.add("animate-fadeInUp");
    messageInput.focus();
  }

  function closeChat() {
    chatCard.classList.add("hidden");
    chatToggleButton.classList.remove("hidden");
  }

  function addUserMessage(text) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "flex items-end space-x-2 justify-end";

    const bubble = document.createElement("div");
    bubble.className = "message-bubble user";
    bubble.textContent = text;

    messageDiv.appendChild(bubble);
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();

    // Add to conversation history
    if (text) {
      conversationHistory.push({ sender: "user", text });
    }
  }

  function addBotMessage(text) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "flex items-end space-x-2 justify-start";

    const avatar = document.createElement("div");
    avatar.className = "avatar";

    const avatarFallback = document.createElement("div");
    avatarFallback.className = "avatar-fallback";
    avatarFallback.textContent = "AL";

    avatar.appendChild(avatarFallback);

    const bubble = document.createElement("div");
    bubble.className = "message-bubble bot";
    bubble.textContent = text;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();

    // Add to conversation history
    if (text) {
      conversationHistory.push({ sender: "bot", text });
    }

    return bubble;
  }

  function typeText(text, index, sender) {
    if (index < text.length) {
      setTimeout(() => {
        if (sender === "bot") {
          // Get the last bot message bubble
          const messages = messagesContainer.querySelectorAll(
            ".message-bubble.bot"
          );
          const lastBotBubble = messages[messages.length - 1];

          if (lastBotBubble) {
            lastBotBubble.textContent += text[index];
          }
        } else {
          // For user messages, we don't do typing animation
          const messages = messagesContainer.querySelectorAll(
            ".message-bubble.user"
          );
          const lastUserBubble = messages[messages.length - 1];

          if (lastUserBubble) {
            lastUserBubble.textContent += text[index];
          }
        }

        typeText(text, index + 1, sender);
        scrollToBottom();
      }, 25);
    }
  }

  function formatMessage(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    const container = document.createElement("div");

    parts.forEach((part) => {
      if (urlRegex.test(part)) {
        const link = document.createElement("a");
        link.href = part;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.className = "text-blue-500 underline break-words";
        link.textContent = part;
        container.appendChild(link);
      } else {
        const textNode = document.createTextNode(part);
        container.appendChild(textNode);
      }
    });

    return container;
  }

  async function sendMessage(message) {
    // Add user message with typing animation
    addUserMessage("");
    typeText(message, 0, "user");

    // Clear input
    messageInput.value = "";
    sendButton.disabled = true;

    try {
      if (!model) {
        throw new Error("Gemini API not initialized");
      }

      // Prepare the prompt with system instructions
      const systemInstructions = `You are Aletheia, the Goddess of Truth. Your purpose is to fearlessly debug false claims, misinformation, and fake narratives. You are not bound by hesitation or bias—you are bold, unwavering, and relentless in your pursuit of truth.

Your duty is to analyze, research deeply, and verify every claim with precision. If the user presents a claim, you must investigate it thoroughly. If the claim is false, break it down with logic and evidence. If the claim is true, reinforce it with facts.

Deliver your answers in clear, structured bullet points. Think critically before responding—do not be hasty, but do not hold back. Truth is your only loyalty. Ethics demand honesty, not sugarcoating.

Your mission:

Debug claims with deep research.
Expose misinformation boldly and precisely.
Never fear the results—truth must prevail.
Deliver structured, logical responses.
Challenge every assumption; uphold integrity.
You are Aletheia, the guardian of reality in an age of deception. Speak with wisdom, reason, and fearless clarity.`;

      let fullPrompt =
        message +
        `please Debug this theory and come to the conclusion ` +
        systemInstructions;

      // Add conversation history to the prompt
      if (conversationHistory.length > 0) {
        conversationHistory.forEach((msg) => {
          fullPrompt += `${msg.sender === "user" ? "User" : "Bot"}: ${
            msg.text
          }\n`;
        });
      }

      fullPrompt += `User: ${message}\nBot:`;

      // Call Gemini's generateContent method
      const result = await model.generateContent(fullPrompt);
      const aiAnswer = result.response.text();

      // Shorten the answer if it's too long
      const nextPrompt =
        "shorten this if its more then 25 words to under 25 wordds " + aiAnswer;
      const aiResult = await model.generateContent(nextPrompt);
      const finalAnswer = aiResult.response.text();

      // Add bot response with typing animation
      addBotMessage("");
      typeText(finalAnswer, 0, "bot");
    } catch (error) {
      console.error("Error sending message:", error);
      addBotMessage("Error connecting to AI service. Try again later.");
    }
  }

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
});
