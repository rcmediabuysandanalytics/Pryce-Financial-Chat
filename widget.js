(function () {
  // Prevent duplicate injections
  if (window.__PRYCE_CHAT_WIDGET__) return;
  window.__PRYCE_CHAT_WIDGET__ = true;

  /* ==========================================================================
     CONFIGURATION
     ========================================================================== */
  const CONFIG = {
    // API Placeholders - Empty strings by default as requested
    API_CHAT_URL: "https://pryce-financial-chat.vercel.app/api/chat", // change this to pryce-chat vercel if already available
    API_LEAD_URL: "https://pryce-financial-chat.vercel.app/api/lead", // change this to pryce-chat vercel if already available

    // UI Config
    TITLE: "Pryce Financial Support",
    WELCOME_MSG: "Hi there! 👋 How can we help you today?",
    FAQ_TOPICS: [
      "Pricing & Plans",
      "Book a Demo",
      "Technical Support",
      "Contact Sales"
    ],
    THEME: {
      primary: "#10304F",       // Royal Gold
      primaryHover: "#0D253D",  // Darker Gold
      bg: "#FFFFFF",            // Dark Gray (Almost Black)
      text: "#1F2937",          // White
      textLight: "#6B7280",     // Gray-400
      border: "#E5E7EB",        // Gray-700
      userMsgBg: "#10304F",     // Gold
      userMsgText: "#FFFFFF",   // Black text on Gold
      botMsgBg: "#F3F4F6",      // Gray-800
      botMsgText: "#F3F4F6"     // Gray-100
    }
  };

  // Common countries list (Compressed for brevity but covers major regions)
  const COUNTRIES = [
    { code: 'US', dial: '+1', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', dial: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', dial: '+1', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', dial: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: 'DE', dial: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', dial: '+33', name: 'France', flag: '🇫🇷' },
    { code: 'IT', dial: '+39', name: 'Italy', flag: '🇮🇹' },
    { code: 'ES', dial: '+34', name: 'Spain', flag: '🇪🇸' },
    { code: 'BR', dial: '+55', name: 'Brazil', flag: '🇧🇷' },
    { code: 'MX', dial: '+52', name: 'Mexico', flag: '🇲🇽' },
    { code: 'IN', dial: '+91', name: 'India', flag: '🇮🇳' },
    { code: 'CN', dial: '+86', name: 'China', flag: '🇨🇳' },
    { code: 'JP', dial: '+81', name: 'Japan', flag: '🇯🇵' },
    { code: 'KR', dial: '+82', name: 'South Korea', flag: '🇰🇷' },
    { code: 'RU', dial: '+7', name: 'Russia', flag: '🇷🇺' },
    { code: 'ZA', dial: '+27', name: 'South Africa', flag: '🇿🇦' },
    { code: 'NG', dial: '+234', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'EG', dial: '+20', name: 'Egypt', flag: '🇪🇬' },
    { code: 'AE', dial: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: 'SA', dial: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'PH', dial: '+63', name: 'Philippines', flag: '🇵🇭' },
    { code: 'SG', dial: '+65', name: 'Singapore', flag: '🇸🇬' },
    { code: 'ID', dial: '+62', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'MY', dial: '+60', name: 'Malaysia', flag: '🇲🇾' },
    { code: 'TH', dial: '+66', name: 'Thailand', flag: '🇹🇭' },
    { code: 'VN', dial: '+84', name: 'Vietnam', flag: '🇻🇳' },
    { code: 'NL', dial: '+31', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'BE', dial: '+32', name: 'Belgium', flag: '🇧🇪' },
    { code: 'SE', dial: '+46', name: 'Sweden', flag: '🇸🇪' },
    { code: 'NO', dial: '+47', name: 'Norway', flag: '🇳🇴' },
    { code: 'DK', dial: '+45', name: 'Denmark', flag: '🇩🇰' },
    { code: 'FI', dial: '+358', name: 'Finland', flag: '🇫🇮' },
    { code: 'PL', dial: '+48', name: 'Poland', flag: '🇵🇱' },
    { code: 'TR', dial: '+90', name: 'Turkey', flag: '🇹🇷' },
    { code: 'IL', dial: '+972', name: 'Israel', flag: '🇮🇱' },
    { code: 'NZ', dial: '+64', name: 'New Zealand', flag: '🇳🇿' },
    { code: 'IE', dial: '+353', name: 'Ireland', flag: '🇮🇪' },
    // Add more as needed
  ];

  /* ==========================================================================
     STYLES (CSS Injection)
     ========================================================================== */
  const STYLES = `
    :root {
      --pryce-primary: ${CONFIG.THEME.primary};
      --pryce-primary-hover: ${CONFIG.THEME.primaryHover};
      --pryce-bg: ${CONFIG.THEME.bg};
      --pryce-text: ${CONFIG.THEME.text};
      --pryce-text-light: ${CONFIG.THEME.textLight};
      --pryce-border: ${CONFIG.THEME.border};
      --pryce-user-bg: ${CONFIG.THEME.userMsgBg};
      --pryce-user-text: ${CONFIG.THEME.userMsgText};
      --pryce-bot-bg: ${CONFIG.THEME.botMsgBg};
      --pryce-bot-text: ${CONFIG.THEME.botMsgText};
      --pryce-font: 'Inter', system-ui, -apple-system, sans-serif;
      --pryce-z-index: 2147483647; /* Max safe integer */
    }

    /* Container Reset */
    #pryce-widget-container {
      font-family: var(--pryce-font);
      box-sizing: border-box;
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: var(--pryce-z-index);
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 16px;
      pointer-events: none; /* Allow clicks through empty space */
      line-height: 1.5;
    }

    #pryce-widget-container * {
      box-sizing: border-box;
      outline: none;
    }

    /* Launcher Button */
    .pryce-launcher {
      pointer-events: auto;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: var(--pryce-primary);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.2s;
      border: none;
      padding: 0;
      position: relative;
    }

    .pryce-launcher:hover {
      background-color: var(--pryce-primary-hover);
      transform: scale(1.05);
    }

    .pryce-launcher:active {
      transform: scale(0.95);
    }

    .pryce-launcher-icon {
      width: 28px;
      height: 28px;
      fill: white;
      transition: opacity 0.3s, transform 0.3s;
      position: absolute;
    }

    .pryce-launcher.pryce-open .pryce-icon-chat {
      opacity: 0;
      transform: rotate(90deg) scale(0.5);
    }

    .pryce-launcher.pryce-open .pryce-icon-close {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }

    .pryce-icon-close {
      opacity: 0;
      transform: rotate(-90deg) scale(0.5);
    }

    /* Pulse Animation */
    @keyframes pryce-pulse {
      0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
      100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
    }

    .pryce-launcher.pryce-pulse:not(.pryce-open) {
      animation: pryce-pulse 2s infinite;
    }

    @media (prefers-reduced-motion: reduce) {
      .pryce-launcher.pryce-pulse {
        animation: none;
      }
    }

    /* Chat Panel */
    .pryce-panel {
      pointer-events: auto;
      width: 350px;
      height: 550px;
      max-height: calc(100vh - 100px);
      max-width: calc(100vw - 40px);
      background: var(--pryce-bg);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      transform-origin: bottom right;
      transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      visibility: hidden;
      position: absolute;
      bottom: 80px;
      right: 0;
    }

    .pryce-panel.pryce-visible {
      opacity: 1;
      transform: translateY(0) scale(1);
      visibility: visible;
    }

    /* Header */
    .pryce-header {
      background: var(--pryce-bg);
      padding: 16px 20px;
      border-bottom: 1px solid var(--pryce-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }

    .pryce-title {
      font-weight: 600;
      font-size: 16px;
      color: var(--pryce-text);
      margin: 0;
    }

    /* Messages Area */
    .pryce-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #fafafa;
      scroll-behavior: smooth;
    }

    .pryce-message {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.4;
      position: relative;
      animation: pryce-fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
      transform: translateY(10px);
      word-wrap: break-word;
    }

    @keyframes pryce-fade-up {
      to { opacity: 1; transform: translateY(0); }
    }

    @media (prefers-reduced-motion: reduce) {
      .pryce-message { animation: none; opacity: 1; transform: none; }
    }

    .pryce-message.pryce-bot {
      background: var(--pryce-bot-bg);
      color: var(--pryce-bot-text);
      align-self: flex-start;
      border-bottom-left-radius: 2px;
    }

    .pryce-message.pryce-user {
      background: var(--pryce-user-bg);
      color: var(--pryce-user-text);
      align-self: flex-end;
      border-bottom-right-radius: 2px;
    }

    /* Typing Indicator */
    .pryce-typing {
      display: flex;
      gap: 4px;
      padding: 12px 16px;
      align-self: flex-start;
      background: var(--pryce-bot-bg);
      border-radius: 12px;
      border-bottom-left-radius: 2px;
      width: fit-content;
    }

    .pryce-dot {
      width: 6px;
      height: 6px;
      background: #9ca3af;
      border-radius: 50%;
      animation: pryce-bounce 1.4s infinite ease-in-out both;
    }

    .pryce-dot:nth-child(1) { animation-delay: -0.32s; }
    .pryce-dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes pryce-bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }

    /* Chips */
    .pryce-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }

    .pryce-chip {
      background: var(--pryce-primary);
      border: 1px solid var(--pryce-primary);
      color: #000000;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      user-select: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .pryce-chip:hover {
      background: var(--pryce-primary-hover);
      border-color: var(--pryce-primary-hover);
      color: #000000;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    /* Input Area */
    .pryce-footer {
      background: var(--pryce-bg);
      padding: 16px; /* 16px to match req */
      border-top: 1px solid var(--pryce-border);
      display: flex;
      gap: 10px;
      flex-shrink: 0;
    }

    .pryce-input {
      flex: 1;
      border: 1px solid var(--pryce-border);
      border-radius: 20px;
      padding: 10px 16px;
      font-size: 14px;
      font-family: var(--pryce-font);
      transition: border-color 0.2s;
    }

    .pryce-input:focus {
      border-color: var(--pryce-primary);
    }

    .pryce-send-btn {
      background: var(--pryce-primary);
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .pryce-send-btn:hover {
      background: var(--pryce-primary-hover);
    }

    .pryce-send-btn svg {
      width: 18px;
      height: 18px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-linejoin: round;
      margin-left: 2px; /* Visual balance */
    }

    /* Lead Form */
    .pryce-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 8px 0;
      width: 100%;
    }

    .pryce-form-field {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--pryce-border);
      border-radius: 8px;
      font-family: var(--pryce-font);
      font-size: 14px;
    }

    .pryce-form-field:focus {
      border-color: var(--pryce-primary);
    }

    .pryce-form-submit {
      background: var(--pryce-primary);
      color: white;
      border: none;
      padding: 10px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      margin-top: 4px;
    }

    .pryce-form-submit:hover {
      background: var(--pryce-primary-hover);
    }

    .pryce-error {
      color: #ef4444;
      font-size: 12px;
      margin-top: -8px;
      display: none;
    }

    .pryce-error.visible {
      display: block;
    }

    /* Icons */
    .pryce-icon-header-close {
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      color: var(--pryce-text-light);
      transition: background 0.2s;
      background: none;
      border: none;
    }
    .pryce-icon-header-close:hover {
      background: var(--pryce-border);
    }

    /* Toast */
    .pryce-toast {
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: #333;
      color: white;
      padding: 10px 16px;
      border-radius: 20px;
      font-size: 14px;
      z-index: 2147483647;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      animation: pryce-fade-in-up 0.3s ease forwards;
      text-align: center;
      width: max-content;
      max-width: 90%;
    }

    @keyframes pryce-fade-in-up {
      from { opacity: 0; transform: translate(-50%, 10px); }
      to { opacity: 1; transform: translate(-50%, 0); }
    }

    /* Disabled State */
    .pryce-disabled {
      opacity: 0.5;
      cursor: not-allowed !important;
      pointer-events: none; /* Block clicks on chips */
    }
    
    /* Allow clicks on disabled input container specifically to trigger toast? 
       Actually, common pattern is: wrapper handles click.
       However, simplified approach: if input is "disabled" via class but not attribute, 
       we can capture click. We will NOT put pointer-events: none on the input itself in JS logic. 
    */
    .pryce-chip.pryce-disabled {
        pointer-events: auto !important; /* Allow click to trigger toast */
    }
    .pryce-input.pryce-disabled {
        pointer-events: auto !important;
        background: #f3f4f6;
    }
    .pryce-send-btn.pryce-disabled {
        pointer-events: auto !important;
    }

    .pryce-faq-btn {
        opacity: 1;
        transition: opacity 0.2s;
    }
    .pryce-faq-btn.pryce-disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: auto !important; /* Capture click */
    }

    /* Country Picker */
    .pryce-phone-group {
      display: flex;
      gap: 8px;
      position: relative;
    }
    .pryce-country-trigger {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 12px;
      border: 1px solid var(--pryce-border);
      border-radius: 8px;
      background: #fff;
      cursor: pointer;
      min-width: 90px;
      justify-content: space-between;
      transition: border-color 0.2s;
    }
    .pryce-country-trigger:hover {
      border-color: var(--pryce-primary);
    }
    .pryce-country-flag {
      font-size: 18px;
      line-height: 1;
      color: #374151;
    }
    .pryce-country-code-text {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
    }
    .pryce-country-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      width: 280px;
      max-height: 240px;
      background: #fff;
      border: 1px solid var(--pryce-border);
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      display: none;
      flex-direction: column;
      z-index: 1000;
      overflow: hidden;
      margin-top: 6px;
      animation: pryce-fade-in-up 0.2s ease-out;
    }
    .pryce-country-dropdown.open {
      display: flex;
    }
    .pryce-country-search {
      padding: 10px;
      border-bottom: 1px solid #f3f4f6;
      background: #fafafa;
    }
    .pryce-country-search input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 13px;
      outline: none;
    }
    .pryce-country-search input:focus {
      border-color: var(--pryce-primary);
    }
    .pryce-country-list {
      overflow-y: auto;
      flex: 1;
      padding: 4px 0;
    }
    .pryce-country-option {
      padding: 8px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      font-size: 14px;
      color: #374151;
      transition: background 0.1s;
    }
    .pryce-country-option:hover {
      background: #f3f4f6;
    }
    .pryce-country-option.selected {
      background: #f0fdf4;
      color: #166534;
    }
    .pryce-country-option-flag {
      font-size: 18px;
    }
    .pryce-country-option-name {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .pryce-country-option-dial {
      color: #9ca3af;
      font-size: 12px;
    }

    /* Modal Overlay */
    .pryce-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 2147483648; /* One higher than widget */
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s;
    }
    .pryce-modal-overlay.open {
      opacity: 1;
      visibility: visible;
    }
    .pryce-modal-content {
      background: white;
      width: 90%;
      max-width: 800px; /* Comfortable reading width */
      height: 90%;
      border-radius: 12px;
      position: relative;
      display: flex;
      flex-direction: column;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      transform: scale(0.95);
      transition: transform 0.3s;
    }
    .pryce-modal-overlay.open .pryce-modal-content {
      transform: scale(1);
    }
    .pryce-modal-close {
      position: absolute;
      top: -12px;
      right: -12px;
      background: white;
      border: 2px solid #ef4444; /* Red border */
      border-radius: 50%;
      width: 32px;
      height: 32px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 16px;
      color: #ef4444; /* Red X */
      transition: all 0.2s;
    }
    .pryce-modal-close:hover {
      background: #fef2f2;
      transform: scale(1.1);
    }
    .pryce-modal-iframe {
      flex: 1;
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 12px;
    }

  `;

  /* ==========================================================================
     LOGIC & STATE
     ========================================================================== */

  // State
  let STATE = {
    isOpen: false,
    messages: [],
    isTyping: false,
    hasInteracted: false,
    activeFlow: null, // 'lead' | 'booking' | null
    isProcessing: false // Lock to prevent duplicate submissions
  };

  // DOM Elements
  let container, launcher, panel, messagesList, inputField, sendBtn;
  let pulseInterval;

  // Icons
  const ICONS = {
    chat: `<svg class="pryce-launcher-icon pryce-icon-chat" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></svg>`,
    close: `<svg class="pryce-launcher-icon pryce-icon-close" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>`,
    send: `<svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`,
    headerClose: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
  };

  // --- Initialization ---

  function init() {
    injectStyles();
    createWidgetDOM();
    setupEventListeners();
    startPulseAnimation();
  }

  function injectStyles() {
    const styleEl = document.createElement('style');
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);
  }

  function createWidgetDOM() {
    container = document.createElement('div');
    container.id = 'pryce-widget-container';

    // Chat Panel
    panel = document.createElement('div');
    panel.className = 'pryce-panel';
    panel.innerHTML = `
      <div class="pryce-header">
        <h3 class="pryce-title">${CONFIG.TITLE}</h3>
        <button class="pryce-icon-header-close" id="pryce-close-btn">${ICONS.headerClose}</button>
      </div>
      <div class="pryce-messages"></div>
      <div class="pryce-footer">
        <input type="text" class="pryce-input" placeholder="Type a message..." />
        <button class="pryce-send-btn">${ICONS.send}</button>
      </div>
    `;

    // Launcher
    launcher = document.createElement('div');
    launcher.className = 'pryce-launcher';
    launcher.setAttribute('role', 'button');
    launcher.setAttribute('aria-label', 'Chat with us');
    launcher.innerHTML = `${ICONS.chat}${ICONS.close}`;

    container.appendChild(panel);
    container.appendChild(launcher);
    document.body.appendChild(container);

    // Cache refs
    messagesList = panel.querySelector('.pryce-messages');
    inputField = panel.querySelector('.pryce-input');
    sendBtn = panel.querySelector('.pryce-send-btn');
  }

  function setupEventListeners() {
    // Toggle Chat
    launcher.addEventListener('click', () => toggleChat());
    panel.querySelector('#pryce-close-btn').addEventListener('click', () => toggleChat(false));



    // Escape Key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && STATE.isOpen) {
        toggleChat(false);
      }
      if (e.key === 'Enter' && document.activeElement === inputField) {
        handleUserMessage();
      }
    });

    // Send Message
    sendBtn.addEventListener('click', (e) => {
      if (handleInteractionCheck(e)) handleUserMessage();
    });

    // Input clicks for toast
    inputField.addEventListener('click', (e) => handleInteractionCheck(e));

    // Block typing if locked
    inputField.addEventListener('keydown', (e) => {
      if (STATE.activeFlow) {
        e.preventDefault();
        // Optionally show toast on keydown too, or just silence
        // showToast(...) 
        return;
      }
    });
  }

  // --- Core Functions ---

  function showToast(text) {
    // Remove existing
    const existing = document.querySelector('.pryce-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'pryce-toast';
    toast.textContent = text;

    // We append to panel so it shows over messages but inside the widget
    panel.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function handleInteractionCheck(e) {
    if (STATE.activeFlow) {
      e.preventDefault();
      e.stopPropagation();
      const flowName = STATE.activeFlow === 'lead' ? "Leave Message" : "Book Appointment";
      showToast(`Please finish or close "${flowName}" first.`);
      return false;
    }
    return true;
  }

  function toggleChat(forceState) {
    const nextState = forceState !== undefined ? forceState : !STATE.isOpen;

    if (nextState === STATE.isOpen) return;
    STATE.isOpen = nextState;

    if (STATE.isOpen) {
      launcher.classList.add('pryce-open');
      launcher.classList.remove('pryce-pulse'); // Stop pulsing when open
      panel.classList.add('pryce-visible');

      // Focus input after transition
      setTimeout(() => inputField.focus(), 300);

      // First open check
      if (STATE.messages.length === 0) {
        // Add welcome message
        addMessage({ text: CONFIG.WELCOME_MSG, type: 'bot' });
        // Add Quick Actions
        renderQuickActions();
      }
    } else {
      launcher.classList.remove('pryce-open');
      panel.classList.remove('pryce-visible');
      // Resume pulse if idle for a bit? (Optional, requirement says "idle", usually means hasn't been opened)
      // We'll restart pulse logic just in case
      startPulseAnimation();
    }
  }

  function startPulseAnimation() {
    // Clear any existing
    clearInterval(pulseInterval);
    // Pulse every 2 seconds interval (continuous with 2s animation)
    const pulse = () => {
      if (!STATE.isOpen) {
        launcher.classList.add('pryce-pulse');
        // No removal needed for continuous looping since CSS is infinite
      }
    };

    // Initial delay then interval
    setTimeout(pulse, 2000);
    pulseInterval = setInterval(pulse, 2000);
  }

  function addMessage({ text, type, isHTML = false }) {
    const msgEl = document.createElement('div');
    msgEl.className = `pryce-message pryce-${type}`;

    if (isHTML) {
      msgEl.innerHTML = text; // Only used for internal safe content
    } else {
      msgEl.textContent = text; // Safe for user input
    }

    messagesList.appendChild(msgEl);
    scrollToBottom();
    STATE.messages.push({ text, type });
  }

  function scrollToBottom() {
    messagesList.scrollTop = messagesList.scrollHeight;
  }

  function renderQuickActions() {
    const chipsContainer = document.createElement('div');
    chipsContainer.className = 'pryce-chips pryce-message pryce-bot';
    chipsContainer.style.background = 'transparent';
    chipsContainer.style.padding = '0';
    chipsContainer.style.maxWidth = '100%';

    const actions = [
      { label: "FAQs", handler: handleShowFAQs },
      { label: "Book Appointment", handler: handleBookAppointment },
      { label: "Leave a message", handler: handleShowLeadForm }
    ];

    actions.forEach(action => {
      const chip = document.createElement('button');
      chip.className = 'pryce-chip';
      chip.textContent = action.label;
      chip.onclick = () => {
        if (!handleInteractionCheck({ preventDefault: () => { }, stopPropagation: () => { } })) return;
        action.handler();
      };
      chipsContainer.appendChild(chip);
    });

    messagesList.appendChild(chipsContainer);
    scrollToBottom();
  }

  async function handleUserMessage(textOverride) {
    if (STATE.activeFlow || STATE.isProcessing) {
      handleInteractionCheck({ preventDefault: () => { }, stopPropagation: () => { } });
      return;
    }

    const text = textOverride || inputField.value.trim();
    if (!text) return;

    if (!textOverride) inputField.value = '';

    // Set lock
    STATE.isProcessing = true;

    addMessage({ text, type: 'user' });

    // Typing indicator while waiting for backend
    startTypingIndicator();

    try {
      // Call n8n and WAIT for the response
      const ai = await sendChatToBackend(text, STATE.messages, window.location.href);

      // Stop typing
      stopTypingIndicator();

      // Accept multiple possible key names from n8n
      const botText =
        ai?.Message ??
        ai?.message ??
        ai?.reply ??
        ai?.output ??
        ai?.text ??
        null;

      let leaveFlag =
        ai?.["Leave Message"] ??
        ai?.leaveMessage ??
        ai?.leave_message ??
        false;

      // Normalize boolean (handle string "true" from some backends)
      if (typeof leaveFlag === 'string') {
        leaveFlag = leaveFlag.toLowerCase() === 'true';
      }

      // Logic: Show text if present. If not, only show error if also NOT showing form.
      let messageShown = false;

      if (botText && typeof botText === "string") {
        addMessage({ text: botText, type: "bot" });
        messageShown = true;
      }

      // If AI says to collect details (relaxed check: truthy)
      if (leaveFlag) {
        // If no text was sent by AI, provide a courteous default transition
        if (!messageShown) {
          addMessage({ text: "#1F2937", type: "bot" });
        }
        setTimeout(() => handleShowLeadForm(), 400);
        return; // Success path (form triggered)
      }

      // If no text and no form, then it's an error
      if (!messageShown) {
        addMessage({
          text: "#1F2937",
          type: "bot",
        });
      }

    } catch (err) {
      console.error("Error in handleUserMessage:", err);
      stopTypingIndicator();
      addMessage({ text: "#1F2937", type: "bot" });
    } finally {
      // Release lock
      STATE.isProcessing = false;
      // Re-focus input for convenience
      if (!STATE.activeFlow) setTimeout(() => inputField.focus(), 100);
    }
  }

  function startTypingIndicator() {
    if (STATE.isTyping) return;

    // Remove any existing (just in case)
    stopTypingIndicator();

    const typingEl = document.createElement('div');
    typingEl.className = 'pryce-typing';
    typingEl.innerHTML = '<div class="pryce-dot"></div><div class="pryce-dot"></div><div class="pryce-dot"></div>';
    messagesList.appendChild(typingEl);
    scrollToBottom();
    STATE.isTyping = true;
  }

  function stopTypingIndicator() {
    const existing = messagesList.querySelector('.pryce-typing');
    if (existing) existing.remove();
    STATE.isTyping = false;
  }

  function localFakeTyping(ms = 800) {
    return new Promise(resolve => {
      startTypingIndicator();
      setTimeout(() => {
        stopTypingIndicator();
        resolve();
      }, ms);
    });
  }

  // --- Feature Logic ---

  function handleShowFAQs() {
    // Show typing then list FAQs
    localFakeTyping(600).then(() => {
      addMessage({ text: "#1F2937", type: 'bot' });

      const faqContainer = document.createElement('div');
      faqContainer.className = 'pryce-message pryce-bot';
      faqContainer.style.background = 'transparent';
      faqContainer.style.padding = '0';
      faqContainer.style.display = 'flex';
      faqContainer.style.flexDirection = 'column';
      faqContainer.style.gap = '8px';
      faqContainer.style.maxWidth = '100%';

      CONFIG.FAQ_TOPICS.forEach(topic => {
        const btn = document.createElement('button');
        btn.className = 'pryce-faq-btn'; // NEW CLASS for styling hooks
        btn.textContent = topic;
        btn.style.padding = '10px 14px';
        btn.style.border = `1px solid ${CONFIG.THEME.primary}`;
        btn.style.borderRadius = '8px';
        btn.style.background = CONFIG.THEME.primary;
        btn.style.color = '#000000';
        btn.style.cursor = 'pointer';
        btn.style.textAlign = 'left';
        btn.style.fontFamily = 'inherit';
        btn.style.fontSize = '14px';
        btn.style.fontWeight = '500';
        btn.style.transition = 'all 0.2s';

        // Hover effect
        btn.onmouseover = () => {
          if (STATE.activeFlow) return;
          btn.style.background = CONFIG.THEME.primaryHover;
          btn.style.borderColor = CONFIG.THEME.primaryHover;
        };
        btn.onmouseout = () => {
          if (STATE.activeFlow) return;
          btn.style.background = CONFIG.THEME.primary;
          btn.style.borderColor = CONFIG.THEME.primary;
        };

        btn.onclick = () => {
          if (handleInteractionCheck({ preventDefault: () => { }, stopPropagation: () => { } })) {
            handleUserMessage(topic);
          }
        };
        faqContainer.appendChild(btn);
      });

      messagesList.appendChild(faqContainer);
      scrollToBottom();
    });
  }

  function handleShowLeadForm() {
    if (STATE.activeFlow) return; // Block if busy
    STATE.activeFlow = 'lead';
    toggleInputLock(true);

    // Default Selection
    let selectedCountry = COUNTRIES.find(c => c.code === 'US') || COUNTRIES[0];
    let userInteracted = false;

    // Append form to messages
    const formContainer = document.createElement('div');
    formContainer.className = 'pryce-message pryce-bot'; // style like a bot message bubble container
    formContainer.style.width = '90%';
    formContainer.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <div style="font-weight:600;">Leave a message</div>
                <button type="button" class="pryce-cancel-btn">✕</button>
            </div>
          
            <form class="pryce-form" id="pryce-lead-form">
                <input class="pryce-form-field" name="name" placeholder="Name *" required />
                <input class="pryce-form-field" name="email" type="email" placeholder="Email" />
                
                <!-- Custom Phone Input with Country Picker -->
                <div class="pryce-phone-group">
                   <div class="pryce-country-trigger" id="pryce-country-trigger">
                      <span class="pryce-country-flag">${selectedCountry.flag}</span>
                      <span class="pryce-country-code-text">${selectedCountry.dial}</span>
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 1L5 5L9 1"/>
                      </svg>
                   </div>
                   <!-- Hidden dropdown -->
                   <div class="pryce-country-dropdown" id="pryce-country-dropdown">
                      <div class="pryce-country-search">
                         <input type="text" placeholder="Search country..." id="pryce-country-search-input">
                      </div>
                      <div class="pryce-country-list" id="pryce-country-list">
                         <!-- Options injected via JS -->
                      </div>
                   </div>

                   <input class="pryce-form-field" name="phone_local" type="tel" placeholder="Phone Number" style="flex:1;" />
                </div>

                <textarea class="pryce-form-field" name="enquiry" rows="3" placeholder="How can we help? *" required></textarea>
                
                <div class="pryce-error" id="pryce-form-error">Please fill in required fields and at least one contact method.</div>
                <button type="submit" class="pryce-form-submit">Send Message</button>
            </form>
        `;

    messagesList.appendChild(formContainer);
    scrollToBottom();

    // -- Picker Logic -- //
    const trigger = formContainer.querySelector('#pryce-country-trigger');
    const dropdown = formContainer.querySelector('#pryce-country-dropdown');
    const searchInput = formContainer.querySelector('#pryce-country-search-input');
    const list = formContainer.querySelector('#pryce-country-list');
    const flagSpan = trigger.querySelector('.pryce-country-flag');
    const codeSpan = trigger.querySelector('.pryce-country-code-text');

    function renderCountryList(filterText = '') {
      list.innerHTML = '';
      const lowerFilter = filterText.toLowerCase();
      COUNTRIES.forEach(c => {
        if (!c.name.toLowerCase().includes(lowerFilter) && !c.code.toLowerCase().includes(lowerFilter) && !c.dial.includes(lowerFilter)) {
          return;
        }
        const item = document.createElement('div');
        item.className = 'pryce-country-option';
        if (c.code === selectedCountry.code) item.classList.add('selected');
        item.innerHTML = `
          <span class="pryce-country-option-flag">${c.flag}</span>
          <span class="pryce-country-option-name">${c.name}</span>
          <span class="pryce-country-option-dial">${c.dial}</span>
        `;
        item.onclick = () => {
          userInteracted = true;
          selectedCountry = c;
          flagSpan.textContent = c.flag;
          codeSpan.textContent = c.dial;
          dropdown.classList.remove('open');
        };
        list.appendChild(item);
      });
    }

    // Initial Render
    renderCountryList();

    // Auto-detect Country
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (!userInteracted && data && data.country_code) {
          const detected = COUNTRIES.find(c => c.code === data.country_code);
          if (detected) {
            selectedCountry = detected;
            flagSpan.textContent = detected.flag;
            codeSpan.textContent = detected.dial;
            renderCountryList(); // Re-render to update selection highlight
          }
        }
      })
      .catch(() => { /* Ignore errors, keep default */ });

    // Event Listeners
    trigger.onclick = (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
      if (dropdown.classList.contains('open')) {
        searchInput.focus();
        // Adjust scroll position if needed? (simple is fine)
      }
    };

    searchInput.onclick = (e) => e.stopPropagation();
    searchInput.oninput = (e) => renderCountryList(e.target.value);

    // Close on click outside
    const closeDropdown = (e) => {
      if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    };
    document.addEventListener('click', closeDropdown);


    // Bind Cancel
    const cancelBtn = formContainer.querySelector('.pryce-cancel-btn');
    cancelBtn.onclick = () => {
      document.removeEventListener('click', closeDropdown); // Clean up
      formContainer.remove();
      addMessage({ text: "#1F2937", type: 'bot' });
      endFlow();
      renderQuickActions(); // Show chips again
    };

    // Bind submit
    const form = formContainer.querySelector('#pryce-lead-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const rawData = Object.fromEntries(formData.entries());

      // Prepare data
      const data = {
        name: rawData.name,
        email: rawData.email,
        enquiry: rawData.enquiry,
        phone: ''
      };

      // Process Phone: Country Dial + Local Number (stripping leading 0s)
      if (rawData.phone_local) {
        // Remove all leading zeros from the local part
        const cleanLocal = rawData.phone_local.replace(/^0+/, '');
        data.phone = selectedCountry.dial + cleanLocal;
      }

      // Validation
      const hasContact = data.email || data.phone;
      if (!data.name || !data.enquiry || !hasContact) {
        form.querySelector('.pryce-error').classList.add('visible');
        return;
      }

      // Cleanup
      document.removeEventListener('click', closeDropdown);

      // Success
      formContainer.innerHTML = `<div style="color:green; font-weight:500;">✓ Sent successfully</div>`;
      endFlow();

      localFakeTyping(600).then(() => {
        addMessage({
          text: "#1F2937",
          type: 'bot'
        });
        sendLeadToBackend(data);
      });
    });
  }

  function endFlow() {
    STATE.activeFlow = null;
    toggleInputLock(false);
  }

  function toggleInputLock(locked) {
    // Toggle opacity classes on Chips too
    const allChips = messagesList.querySelectorAll('.pryce-chip, .pryce-chip-like'); // Add custom selector for FAQ buttons if needed
    // Assuming FAQ buttons are not .pryce-chip, let's target them generically or add class
    // In handleShowFAQs they are just buttons. 
    // Let's rely on global .pryce-disabled usage:

    if (locked) {
      // Disable Inputs
      inputField.classList.add('pryce-disabled');
      // Remove 'disabled' attribute so we can catch clicks
      inputField.removeAttribute('disabled');
      inputField.readOnly = true; // Prevent typing but allow focus/click

      // Disable Send
      sendBtn.classList.add('pryce-disabled');
      sendBtn.disabled = true; // Actually we want to capture click on button too?
      // If disabled=true, button doesn't fire click events in some browsers. 
      // Better to remove disabled attribute and use class + onClick check.
      sendBtn.removeAttribute('disabled');

      // Chips
      document.querySelectorAll('.pryce-chip').forEach(el => el.classList.add('pryce-disabled'));

      // FAQ buttons (manually styled in handleShowFAQs), we'll add a helper class there if possible, 
      // OR just iterate all buttons in messagesList?
      // Let's do a broad sweep or add 'pryce-disabled' to them.
      // Since we didn't add a class to FAQ buttons in handleShowFAQs, let's grab them by tag/style or update handleShowFAQs to add a class.
      // For now, let's leave FAQ visual updates for a more robust pass if needed, 
      // OR we can querySelect all buttons inside messagesList that are not in the active form.
      messagesList.querySelectorAll('button').forEach(btn => {
        // Don't disable the form buttons themselves
        if (!btn.closest('.pryce-form, .pryce-message.pryce-bot')) {
          // This is tricky selector logic. 
          // Simplest: .pryce-chip handled. FAQ buttons need class.
        }
        if (btn.classList.contains('pryce-chip')) {
          btn.classList.add('pryce-disabled');
        }
        // If it's an FAQ button (detected by inline style or context)
        // We'll update handleShowFAQs to add a class 'pryce-faq-btn' next time?
        // For now, let's just make sure Chips + Input are covered as main requirement.
      });

      // FAQ Buttons
      document.querySelectorAll('.pryce-faq-btn').forEach(el => el.classList.add('pryce-disabled'));
    } else {
      inputField.classList.remove('pryce-disabled');
      inputField.readOnly = false;

      sendBtn.classList.remove('pryce-disabled');

      document.querySelectorAll('.pryce-chip').forEach(el => el.classList.remove('pryce-disabled'));
      document.querySelectorAll('.pryce-faq-btn').forEach(el => el.classList.remove('pryce-disabled'));

      setTimeout(() => inputField.focus(), 100);
    }
  }

  /* ==========================================================================
     Booking Logic
     ========================================================================== */

  function handleBookAppointment() {
    if (STATE.activeFlow) return;

    // Direct Modal Logic
    const bookingUrl = "https://api.leadconnectorhq.com/widget/booking/6kJIqNK4AS4XXMXnrAc9";

    // Create Modal DOM
    const overlay = document.createElement('div');
    overlay.className = 'pryce-modal-overlay';

    // Accessibility
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    overlay.innerHTML = `
      <div class="pryce-modal-content">
        <button class="pryce-modal-close" aria-label="Close booking">✕</button>
        <iframe src="${bookingUrl}" class="pryce-modal-iframe" title="Booking Calendar"></iframe>
      </div>
    `;

    document.body.appendChild(overlay);

    const iframe = overlay.querySelector('iframe');
    let hasBookingStarted = false;

    // Detect interaction: If focus shifts to iframe, assume user is "booking"
    const onFocusListener = () => {
      if (document.activeElement === iframe) {
        hasBookingStarted = true;
      }
    };
    window.addEventListener('blur', onFocusListener);

    // Animation
    requestAnimationFrame(() => {
      overlay.classList.add('open');
    });

    // Close logic
    const closeBtn = overlay.querySelector('.pryce-modal-close');
    const close = () => {
      window.removeEventListener('blur', onFocusListener); // Cleanup
      overlay.classList.remove('open');
      setTimeout(() => overlay.remove(), 300); // Wait for transition
    };

    closeBtn.onclick = close;

    // Close on click outside (conditioned)
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        if (!hasBookingStarted) {
          close();
        } else {
          // Visual feedback that they can't close via click anymore
          closeBtn.style.transform = 'scale(1.2)';
          setTimeout(() => closeBtn.style.transform = '', 200);
        }
      }
    };

    // Inform user in chat (optional)
    addMessage({ text: "#1F2937", type: 'bot' });
  }

  /* LEGACY BOOKING LOGIC (COMMENTED OUT)
  function handleBookAppointment_LEGACY() {
    if (STATE.activeFlow) return;
    STATE.activeFlow = 'booking';
    toggleInputLock(true);

    localFakeTyping(600).then(() => {
      addMessage({ text: "#1F2937", type: 'bot' });
      renderCalendar();
    });
  }

  function renderCalendar() {
    const calendarContainer = document.createElement('div');
    calendarContainer.className = 'pryce-message pryce-bot'; // Bubble style
    calendarContainer.style.background = 'white';
    calendarContainer.style.padding = '12px';
    calendarContainer.style.width = '100%';
    calendarContainer.style.display = 'flex';
    calendarContainer.style.flexDirection = 'column';
    calendarContainer.style.gap = '12px';

    // Cancel Btn (Top Right)
    const headerRow = document.createElement('div');
    headerRow.style.display = 'flex';
    headerRow.style.justifyContent = 'flex-end';
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'pryce-cancel-btn';
    cancelBtn.textContent = '✕';
    cancelBtn.onclick = () => {
      calendarContainer.remove();
      addMessage({ text: "#1F2937", type: 'bot' });
      endFlow();
      renderQuickActions();
    };
    headerRow.appendChild(cancelBtn);
    calendarContainer.appendChild(headerRow);

    // State for navigation
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    // Content Wrapper (Header + Grid)
    const contentDiv = document.createElement('div');
    contentDiv.style.display = 'flex';
    contentDiv.style.flexDirection = 'column';
    contentDiv.style.gap = '8px';
    calendarContainer.appendChild(contentDiv);

    // Render Function
    const render = () => {
      contentDiv.innerHTML = ''; // Clear previous

      // 1. Navigation Header
      const nav = document.createElement('div');
      nav.style.display = 'flex';
      nav.style.justifyContent = 'space-between';
      nav.style.alignItems = 'center';
      nav.style.marginBottom = '8px';

      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      // Prev Button
      const prevBtn = document.createElement('button');
      prevBtn.textContent = '‹';
      prevBtn.style.background = 'none';
      prevBtn.style.border = 'none';
      prevBtn.style.fontSize = '20px';
      prevBtn.style.cursor = 'pointer';
      prevBtn.style.padding = '0 8px';

      // Disable if trying to go back past current month
      const today = new Date();
      if (currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
        prevBtn.disabled = true;
        prevBtn.style.opacity = '0.3';
        prevBtn.style.cursor = 'default';
      } else {
        prevBtn.onclick = () => {
          currentMonth--;
          if (currentMonth < 0) { currentMonth = 11; currentYear--; }
          render();
        };
      }

      // Label
      const label = document.createElement('span');
      label.textContent = `${monthNames[currentMonth]} ${currentYear}`;
      label.style.fontWeight = 'bold';
      label.style.color = '#333';

      // Next Button
      const nextBtn = document.createElement('button');
      nextBtn.textContent = '›';
      nextBtn.style.background = 'none';
      nextBtn.style.border = 'none';
      nextBtn.style.fontSize = '20px';
      nextBtn.style.cursor = 'pointer';
      nextBtn.style.padding = '0 8px';
      nextBtn.onclick = () => {
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        render();
      };

      nav.appendChild(prevBtn);
      nav.appendChild(label);
      nav.appendChild(nextBtn);
      contentDiv.appendChild(nav);

      // 2. Grid
      const grid = document.createElement('div');
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
      grid.style.gap = '4px';

      // Days Header
      ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(d => {
        const el = document.createElement('div');
        el.textContent = d;
        el.style.fontSize = '12px';
        el.style.textAlign = 'center';
        el.style.color = '#999';
        grid.appendChild(el);
      });

      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      // Empty slots
      for (let i = 0; i < firstDay; i++) {
        grid.appendChild(document.createElement('div'));
      }

      // Days
      for (let day = 1; day <= daysInMonth; day++) {
        const dateBtn = document.createElement('button');
        dateBtn.textContent = day;
        dateBtn.style.border = 'none';
        dateBtn.style.background = 'transparent';
        dateBtn.style.padding = '6px';
        dateBtn.style.borderRadius = '50%';
        dateBtn.style.fontSize = '14px';

        const thisDate = new Date(currentYear, currentMonth, day);
        // Disable past dates
        if (thisDate < new Date().setHours(0, 0, 0, 0)) {
          dateBtn.style.color = '#ccc';
          dateBtn.style.cursor = 'default';
        } else {
          dateBtn.style.color = '#333';
          dateBtn.style.cursor = 'pointer';
          dateBtn.onclick = () => {
            calendarContainer.innerHTML = `<div style="text-align:center; color:#666;">Date selected: ${thisDate.toLocaleDateString()}</div>`;
            handleDateSelection(currentYear, currentMonth, day);
          };

          // Hover
          dateBtn.onmouseover = () => dateBtn.style.background = '#f3f4f6';
          dateBtn.onmouseout = () => dateBtn.style.background = 'transparent';
        }

        grid.appendChild(dateBtn);
      }
      contentDiv.appendChild(grid);
    };

    // Initial Render
    render();

    messagesList.appendChild(calendarContainer);
    scrollToBottom();
  }

  function handleDateSelection(year, month, day) {
    // Show typing
    const dateStr = new Date(year, month, day).toLocaleDateString();
    addMessage({ text: `Date selected: ${dateStr}`, type: 'user' });

    setTimeout(() => {
      localFakeTyping(600).then(() => {
        addMessage({ text: "#1F2937", type: 'bot' });
        renderTimeSlots(year, month, day);
      });
    }, 1000);
  }

  function renderTimeSlots(year, month, day) {
    const slotsContainer = document.createElement('div');
    slotsContainer.className = 'pryce-message pryce-bot';
    slotsContainer.style.background = 'transparent';
    slotsContainer.style.padding = '0';
    slotsContainer.style.display = 'flex';
    slotsContainer.style.flexWrap = 'wrap';
    slotsContainer.style.gap = '8px';

    // 8AM to 12PM EST (5 hours: 8, 9, 10, 11, 12)
    const estHours = [8, 9, 10, 11, 12];

    estHours.forEach(hour => {
      let targetDate = null;
      // Iterate possible UTC hours (11 to 18) to find which one is "8AM" etc in NY
      // 8AM EST is usually 13:00 UTC (winter) or 12:00 UTC (summer)
      // We search a safe range around noon UTC
      for (let h = 10; h < 20; h++) {
        const testDate = new Date(Date.UTC(year, month, day, h, 0, 0));
        const nyTime = testDate.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour12: false });
        const nyHour = parseInt(nyTime.split(':')[0]);
        if (nyHour === hour) {
          targetDate = testDate;
          break;
        }
      }

      if (targetDate) {
        // Now display targetDate in user's local time
        const localStr = targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const btn = document.createElement('button');
        btn.textContent = localStr;
        btn.className = 'pryce-chip';
        btn.style.margin = '0';

        btn.onclick = () => {
          handleBookingConfirm(year, month, day, localStr, targetDate, slotsContainer);
        };

        slotsContainer.appendChild(btn);
      }
    });

    messagesList.appendChild(slotsContainer);
    scrollToBottom();
  }

  function handleBookingConfirm(year, month, day, timeStr, fullDate, containerToReplace) {
    if (containerToReplace) {
      containerToReplace.innerHTML = `<div style="text-align:center; color:#666; font-size:12px;">Time selected: ${timeStr}</div>`;
    }

    addMessage({ text: `I'd like to book for ${timeStr}`, type: 'user' });

    localFakeTyping(600).then(() => {
      addMessage({ text: "#1F2937", type: 'bot' });
      renderBookingForm(year, month, day, timeStr, fullDate);
    });
  }

  function renderBookingForm(year, month, day, timeStr, fullDate) {
    // Default Selection
    let selectedCountry = COUNTRIES.find(c => c.code === 'US') || COUNTRIES[0];

    const formContainer = document.createElement('div');
    formContainer.className = 'pryce-message pryce-bot';
    formContainer.style.width = '90%';
    formContainer.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div style="font-weight:600;">Confirm Booking</div>
            <button type="button" class="pryce-cancel-btn">✕</button>
        </div>
        <div style="font-size:13px; color:#666; margin-bottom:12px;">
            ${new Date(year, month, day).toLocaleDateString()} at ${timeStr}
        </div>
      
        <form class="pryce-form" id="pryce-booking-form">
            <input class="pryce-form-field" name="name" placeholder="Name *" required />
            <input class="pryce-form-field" name="email" type="email" placeholder="Email" />
            
            <!-- Custom Phone Input with Country Picker -->
            <div class="pryce-phone-group">
               <div class="pryce-country-trigger" id="pryce-country-trigger-booking">
                  <span class="pryce-country-flag">${selectedCountry.flag}</span>
                  <span class="pryce-country-code-text">${selectedCountry.dial}</span>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 1L5 5L9 1"/>
                  </svg>
               </div>
               <!-- Hidden dropdown -->
               <div class="pryce-country-dropdown" id="pryce-country-dropdown-booking">
                  <div class="pryce-country-search">
                     <input type="text" placeholder="Search country..." id="pryce-country-search-input-booking">
                  </div>
                  <div class="pryce-country-list" id="pryce-country-list-booking">
                     <!-- Options injected via JS -->
                  </div>
               </div>

               <input class="pryce-form-field" name="phone_local" type="tel" placeholder="Phone Number" style="flex:1;" />
            </div>

            <textarea class="pryce-form-field" name="notes" rows="2" placeholder="Notes (optional)"></textarea>
            
            <div class="pryce-error" id="pryce-booking-error">Please provide Name and at least one contact method.</div>
            <button type="submit" class="pryce-form-submit">Confirm Booking</button>
        </form>
    `;

    messagesList.appendChild(formContainer);
    scrollToBottom();

    // -- Picker Logic (Duplicate logic, scoped to this container) -- //
    const trigger = formContainer.querySelector('#pryce-country-trigger-booking');
    const dropdown = formContainer.querySelector('#pryce-country-dropdown-booking');
    const searchInput = formContainer.querySelector('#pryce-country-search-input-booking');
    const list = formContainer.querySelector('#pryce-country-list-booking');
    const flagSpan = trigger.querySelector('.pryce-country-flag');
    const codeSpan = trigger.querySelector('.pryce-country-code-text');

    function renderCountryList(filterText = '') {
      list.innerHTML = '';
      const lowerFilter = filterText.toLowerCase();
      COUNTRIES.forEach(c => {
        if (!c.name.toLowerCase().includes(lowerFilter) && !c.code.toLowerCase().includes(lowerFilter) && !c.dial.includes(lowerFilter)) {
          return;
        }
        const item = document.createElement('div');
        item.className = 'pryce-country-option';
        if (c.code === selectedCountry.code) item.classList.add('selected');
        item.innerHTML = `
          <span class="pryce-country-option-flag">${c.flag}</span>
          <span class="pryce-country-option-name">${c.name}</span>
          <span class="pryce-country-option-dial">${c.dial}</span>
        `;
        item.onclick = () => {
          selectedCountry = c;
          flagSpan.textContent = c.flag;
          codeSpan.textContent = c.dial;
          dropdown.classList.remove('open');
        };
        list.appendChild(item);
      });
    }

    // Initial Render
    renderCountryList();

    // Event Listeners
    trigger.onclick = (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
      if (dropdown.classList.contains('open')) {
        searchInput.focus();
      }
    };

    searchInput.onclick = (e) => e.stopPropagation();
    searchInput.oninput = (e) => renderCountryList(e.target.value);

    // Close on click outside
    const closeDropdown = (e) => {
      if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    };
    document.addEventListener('click', closeDropdown);


    // Bind Cancel
    const cancelBtn = formContainer.querySelector('.pryce-cancel-btn');
    cancelBtn.onclick = () => {
      document.removeEventListener('click', closeDropdown);
      formContainer.remove();
      addMessage({ text: "#1F2937", type: 'bot' });
      endFlow();
      renderQuickActions();
    };

    // Bind Submit
    const form = formContainer.querySelector('#pryce-booking-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const rawData = Object.fromEntries(formData.entries());

      // Prepare data
      const data = {
        name: rawData.name,
        email: rawData.email,
        phone: '',
        notes: rawData.notes
      };

      // Process Phone
      if (rawData.phone_local) {
        const cleanLocal = rawData.phone_local.replace(/^0+/, '');
        data.phone = selectedCountry.dial + cleanLocal;
      }

      // Validation
      const hasContact = data.email || data.phone;
      if (!data.name || !hasContact) {
        form.querySelector('.pryce-error').classList.add('visible');
        return;
      }

      // Cleanup
      document.removeEventListener('click', closeDropdown);

      // Success UI
      formContainer.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px;">
                <div style="color:green; font-size:24px;">✓</div>
                <div>
                    <div style="font-weight:600;">Booking Confirmed!</div>
                    <div style="font-size:12px; color:#666;">${new Date(year, month, day).toLocaleDateString()} @ ${timeStr}</div>
                </div>
            </div>`;

      endFlow();

      localFakeTyping(600).then(() => {
        addMessage({
          text: "#1F2937",
          type: 'bot'
        });

        // Construct Payload
        const payload = {
          type: "booking",
          name: data.name,
          email: data.email,
          phone: data.phone,
          notes: data.notes,
          date: new Date(year, month, day).toLocaleDateString(),
          time: timeStr, // User local string
          timestamp: fullDate.toISOString(),
          pageUrl: window.location.href,
          transcript: STATE.messages
        };

        sendLeadToBackend(payload);
      });
    });
  }
  */

  /* ==========================================================================
  /* ==========================================================================
     BACKEND INTEGRATION
     ========================================================================== */

  function getSessionId() {
    if (!window.__PRYCE_CHAT_SESSION_ID__) {
      // Simple random ID generation
      window.__PRYCE_CHAT_SESSION_ID__ = 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }
    return window.__PRYCE_CHAT_SESSION_ID__;
  }

  async function postToN8N(url, payload) {
    if (!url) return null;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const contentType = (res.headers.get("content-type") || "").toLowerCase();
      const raw = contentType.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        console.error("n8n response not OK:", res.status, raw);
        return null;
      }

      // n8n often responds as: [{...}] when "All Incoming Items"
      if (Array.isArray(raw)) return raw[0] || null;

      // If it came back as text but is actually JSON, parse it
      if (typeof raw === "string") {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed[0] || null;
          if (parsed && typeof parsed === "object") return parsed;
        } catch (_) {
          return null;
        }
      }

      if (raw && typeof raw === "object") return raw;

      return null;
    } catch (e) {
      console.error("Backend request failed:", e);
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }


  async function sendChatToBackend(message, transcript, pageUrl) {
    if (!CONFIG.API_CHAT_URL) return null;

    const payload = {
      event: 'chat_message',
      type: 'Normal/FAQ',
      sessionId: getSessionId(),
      pageUrl: pageUrl || window.location.href,
      timestamp: new Date().toISOString(),
      message: message,
      transcript: transcript,
      meta: {
        userAgent: navigator.userAgent,
        referrer: document.referrer
      }
    };

    return await postToN8N(CONFIG.API_CHAT_URL, payload);
  }

  async function sendLeadToBackend(data) {
    if (!CONFIG.API_LEAD_URL) return;

    const basePayload = {
      sessionId: getSessionId(),
      pageUrl: data.pageUrl || window.location.href,
      timestamp: new Date().toISOString(),
      transcript: data.transcript || STATE.messages,
      meta: {
        userAgent: navigator.userAgent,
        referrer: document.referrer
      }
    };

    let payload = {};

    if (data.type === 'booking') {
      // Booking Appointment Payload
      payload = {
        ...basePayload,
        event: 'booking_submit',
        type: 'Appointment', // Added for n8n routing
        booking: {
          date: data.date,
          time: data.time,
          datetimeISO: data.timestamp // ISO 8601 from passed fullDate
        },
        contact: {
          name: data.name,
          email: data.email,
          phone: data.phone
        },
        notes: data.notes || ''
      };
    } else {
      // Leave Message Payload (Default)
      // Adjust for structure difference if necessary, assuming data is flat from form
      payload = {
        ...basePayload,
        event: 'lead_submit',
        type: 'Leave Message', // Added for n8n routing
        lead: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.enquiry // Form field is 'enquiry'
        }
      };
    }

    await postToN8N(CONFIG.API_LEAD_URL, payload);
  }

  // Kickoff
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

