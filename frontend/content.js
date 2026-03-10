function addRecordingBanner() {
    if (document.getElementById("safeSpaceBanner")) return;

    const banner = document.createElement("div");
    banner.id = "safeSpaceBanner";

    banner.innerHTML = `
        <span style="
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background-color: rgba(255,255,255,0.15);
            padding: 3px 12px;
            border-radius: 20px;
            font-size: 12px;
        ">
            <span style="
                width: 8px;
                height: 8px;
                background-color: #fff;
                border-radius: 50%;
                display: inline-block;
                animation: safeSpacePulse 1.5s infinite;
            "></span>
            SafeSpace Active - Emails are being monitored for offensive content
        </span>
    `;

    const style = document.createElement("style");
    style.textContent = `
        @keyframes safeSpacePulse {
            0%   { opacity: 1; transform: scale(1); }
            50%  { opacity: 0.4; transform: scale(1.3); }
            100% { opacity: 1; transform: scale(1); }
        }
        #safeSpaceBanner {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(90deg, #1a1a2e, #16213e, #0f3460);
            color: white;
            font-size: 12px;
            font-weight: 600;
            font-family: 'Segoe UI', Arial, sans-serif;
            text-align: center;
            padding: 6px;
            z-index: 9999;
            letter-spacing: 0.4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(banner);
    document.body.style.paddingTop = "30px";
}

function showOffensivePopup(classification, confidence) {
    if (document.getElementById("safeSpacePopup")) return;

    const style = document.createElement("style");
    style.textContent = `
        @keyframes safeSpaceSlideIn {
            from { opacity: 0; transform: scale(0.9) translateY(-10px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        #safeSpacePopup {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-color: rgba(15, 52, 96, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(4px);
        }
        #safeSpacePopupCard {
            background: white;
            border-radius: 16px;
            padding: 36px 32px;
            max-width: 420px;
            width: 90%;
            text-align: center;
            font-family: 'Segoe UI', Arial, sans-serif;
            box-shadow: 0 20px 60px rgba(15, 52, 96, 0.3);
            animation: safeSpaceSlideIn 0.25s ease forwards;
            border-top: 5px solid #0f3460;
        }
        #safeSpacePopupCard .ss-icon {
            font-size: 48px;
            margin-bottom: 12px;
        }
        #safeSpacePopupCard .ss-badge {
            display: inline-block;
            background: #e8f0fb;
            color: #0f3460;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            padding: 4px 12px;
            border-radius: 20px;
            margin-bottom: 16px;
        }
        #safeSpacePopupCard h2 {
            font-size: 20px;
            font-weight: 700;
            color: #0f3460;
            margin: 0 0 10px 0;
        }
        #safeSpacePopupCard .ss-divider {
            height: 1px;
            background: #e0e8f5;
            margin: 16px 0;
        }
        #safeSpacePopupCard .ss-classification {
            display: inline-block;
            background: linear-gradient(135deg, #1a1a2e, #0f3460);
            color: white;
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            padding: 6px 16px;
            border-radius: 20px;
            margin-bottom: 12px;
        }
        #safeSpacePopupCard .ss-confidence {
            font-size: 13px;
            color: #555;
            margin-bottom: 8px;
        }
        #safeSpacePopupCard .ss-confidence span {
            font-weight: 700;
            color: #0f3460;
        }
        #safeSpacePopupCard .ss-confidence-bar {
            height: 6px;
            background: #e0e8f5;
            border-radius: 3px;
            margin: 8px 0 16px 0;
            overflow: hidden;
        }
        #safeSpacePopupCard .ss-confidence-bar-fill {
            height: 100%;
            background: linear-gradient(135deg, #1a1a2e, #0f3460);
            border-radius: 3px;
        }
        #safeSpacePopupCard p {
            font-size: 13px;
            color: #555;
            margin: 0 0 20px 0;
            line-height: 1.5;
        }
        #safeSpaceCancelBtn {
            padding: 10px 28px;
            background: linear-gradient(135deg, #1a1a2e, #0f3460);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: opacity 0.2s;
            letter-spacing: 0.3px;
        }
        #safeSpaceCancelBtn:hover {
            opacity: 0.85;
        }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement("div");
    overlay.id = "safeSpacePopup";

    const popup = document.createElement("div");
    popup.id = "safeSpacePopupCard";

    popup.innerHTML = `
        <div class="ss-badge">SafeSpace Alert</div>
        <h2>Offensive Content Detected</h2>
        <div class="ss-divider"></div>
        <div class="ss-classification">${classification}</div>
        <div class="ss-confidence">
            AI Confidence: <span>${(confidence * 100).toFixed(1)}%</span>
        </div>
        <div class="ss-confidence-bar">
            <div class="ss-confidence-bar-fill" style="width: ${(confidence * 100).toFixed(1)}%"></div>
        </div>
        <p>Your email contains language that may be offensive or inappropriate.<br>Please review and rephrase before sending.</p>
    `;

    const cancelBtn = document.createElement("button");
    cancelBtn.id = "safeSpaceCancelBtn";
    cancelBtn.innerText = "Edit Email";
    cancelBtn.addEventListener("click", () => overlay.remove());

    popup.appendChild(cancelBtn);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

function getEmailContent() {
    const subjectField = document.querySelector('input[aria-label="Subject"]');
    const bodyDiv = document.querySelector('div.elementToProof');

    const subject = subjectField ? subjectField.value : "";
    const body = bodyDiv ? bodyDiv.innerText : "";

    // Combine subject and body so AI checks full context
    const fullEmail = `Subject: ${subject}\n\n${body}`;

    console.log("SafeSpace captured email:");
    console.log(fullEmail);

    sendToBackend(fullEmail);
}

let sendBlocked = false; // prevents multiple sends while AI is checking

function sendToBackend(emailText) {
    const sendButton = document.querySelector('button[aria-label="Send"]');
    if (!sendButton) return;

    fetch("http://127.0.0.1:8000/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: emailText })
    })
        .then(res => res.json())
        .then(data => {
            // Log full AI response for debugging
            console.log("SafeSpace AI result:", data);

            if (data.offensive) {
                // Email is toxic/racist/sexist — block send and warn user
                showOffensivePopup(data.classification, data.confidence);
                sendBlocked = false; // let user edit and try again
            } else {
                // Email is safe — proceed with sending
                actuallySendEmail(sendButton);
            }
        })
        .catch(err => {
            // If backend is offline log error and unblock send
            console.error("SafeSpace backend error:", err);
            sendBlocked = false;
        });
}

function actuallySendEmail(sendButton) {
    if (!sendButton) return;

    // Remove interceptor first to avoid triggering our check again
    sendButton.removeEventListener("click", handleSendClick);

    // Simulate real mouse click to trigger Outlook send
    sendButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    sendButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    sendButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    // Re-attach interceptor for next email
    setupSendButton();
}

function handleSendClick(event) {
    const sendButton = event.currentTarget;

    if (!sendBlocked) {
        // First click — block send and start AI check
        event.preventDefault();
        event.stopPropagation();

        sendBlocked = true; // block further clicks while checking
        getEmailContent();  // capture email and send to AI
    } else {
        // Already checking — block this click too
        event.preventDefault();
        event.stopPropagation();
    }
}


function setupSendButton() {
    const sendButton = document.querySelector('button[aria-label="Send"]');

    if (sendButton) {
        sendButton.style.setProperty("background", "linear-gradient(135deg, #1a1a2e, #0f3460)", "important");
        sendButton.style.setProperty("color", "white", "important");
        sendButton.style.setProperty("border", "none", "important");
    sendButton.style.setProperty("border-radius", "8px 0px 0px 8px", "important");
        sendButton.style.setProperty("font-weight", "600", "important");
        sendButton.style.setProperty("letter-spacing", "0.3px", "important");
        sendButton.style.setProperty("box-shadow", "0 2px 8px rgba(15, 52, 96, 0.4)", "important");
        sendButton.style.setProperty("transition", "opacity 0.2s", "important");
        sendButton.style.setProperty("cursor", "pointer", "important");

        sendButton.addEventListener("mouseover", () => {
            sendButton.style.setProperty("opacity", "0.85", "important");
        });
        sendButton.addEventListener("mouseout", () => {
            sendButton.style.setProperty("opacity", "1", "important");
        });

        sendButton.removeEventListener("click", handleSendClick);
        sendButton.addEventListener("click", handleSendClick);

        console.log("SafeSpace: Send button ready");
    } else {
        setTimeout(setupSendButton, 500);
    }
}

function addReportButtons() {
    const forwardButtons = document.querySelectorAll('button[aria-label="Forward"]');

    forwardButtons.forEach(forwardBtn => {
        // Skip if report button already added next to this forward button
        if (forwardBtn.nextElementSibling && forwardBtn.nextElementSibling.id === "safeSpaceReportBtn") {
            return;
        }

        const reportBtn = document.createElement("button");
        reportBtn.id = "safeSpaceReportBtn";
        reportBtn.type = "button";
        reportBtn.innerText = "⚑ Report";
        reportBtn.setAttribute("aria-label", "Report Email");

        reportBtn.style.marginLeft = "6px";
        reportBtn.style.padding = "6px 14px";
        reportBtn.style.background = "linear-gradient(135deg, #1a1a2e, #0f3460)";
        reportBtn.style.color = "white";
        reportBtn.style.border = "none";
        reportBtn.style.borderRadius = "8px";
        reportBtn.style.cursor = "pointer";
        reportBtn.style.fontWeight = "600";
        reportBtn.style.fontSize = "12px";
        reportBtn.style.letterSpacing = "0.3px";
        reportBtn.style.boxShadow = "0 2px 8px rgba(15, 52, 96, 0.4)";
        reportBtn.style.transition = "opacity 0.2s";
        reportBtn.style.fontFamily = "'Segoe UI', Arial, sans-serif";

        reportBtn.addEventListener("mouseover", () => reportBtn.style.opacity = "0.85");
        reportBtn.addEventListener("mouseout", () => reportBtn.style.opacity = "1");

        reportBtn.addEventListener("click", () => {
            console.log("SafeSpace: Report button clicked");
            // for testing only
            showReportPopup();

            // Collect email details
            const subject = getEmailSubject();
            const body = getEmailBody();
            const sender = getSenderName();

            console.log("SafeSpace: Reporting email from", sender);

            // POST reported email to backend /report endpoint
            fetch("http://127.0.0.1:8000/report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sender: sender,
                    subject: subject,
                    body: body
                })
            })
                .then(res => res.json())
                .then(data => {
                    console.log("SafeSpace report response:", data);
                    // Show toast confirmation to user
                    showReportPopup();
                })
                .catch(err => {
                    console.error("SafeSpace report error:", err);
                });
        });

        // Insert Report button right after Forward button
        forwardBtn.parentNode.insertBefore(reportBtn, forwardBtn.nextSibling);
    });
}

function showReportPopup() {
    const style = document.createElement("style");
    style.textContent = `
        @keyframes safeSpaceToastIn {
            from { opacity: 0; transform: translateX(20px); }
            to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes safeSpaceToastOut {
            from { opacity: 1; transform: translateX(0); }
            to   { opacity: 0; transform: translateX(20px); }
        }
        #safeSpaceToast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 20px;
            background: linear-gradient(135deg, #1a1a2e, #0f3460);
            color: white;
            border-radius: 12px;
            z-index: 99999;
            font-size: 13px;
            max-width: 320px;
            box-shadow: 0 8px 24px rgba(15, 52, 96, 0.4);
            font-family: 'Segoe UI', Arial, sans-serif;
            font-weight: 500;
            line-height: 1.5;
            letter-spacing: 0.2px;
            animation: safeSpaceToastIn 0.3s ease forwards;
            border-left: 4px solid #4a90d9;
        }
        #safeSpaceToast .ss-toast-title {
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        #safeSpaceToast .ss-toast-bar {
            height: 3px;
            background: rgba(255,255,255,0.2);
            border-radius: 2px;
            margin-top: 12px;
            overflow: hidden;
        }
        #safeSpaceToast .ss-toast-bar-fill {
            height: 100%;
            width: 100%;
            background: #4a90d9;
            border-radius: 2px;
            animation: safeSpaceToastProgress 5s linear forwards;
        }
        @keyframes safeSpaceToastProgress {
            from { width: 100%; }
            to   { width: 0%; }
        }
    `;
    document.head.appendChild(style);

    const popup = document.createElement("div");
    popup.id = "safeSpaceToast";

    popup.innerHTML = `
        <div class="ss-toast-title">SafeSpace - Email Reported</div>
        This email has been flagged and reported. Our system will review the content to ensure communication remains respectful and professional.
        <div class="ss-toast-bar"><div class="ss-toast-bar-fill"></div></div>
    `;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.animation = "safeSpaceToastOut 0.3s ease forwards";
        setTimeout(() => popup.remove(), 300);
    }, 5000);
}

function getEmailSubject() {
    const messageSpans = document.querySelectorAll("span.JdFsz");

    if (messageSpans.length === 0) {
        console.log("SafeSpace: No subject found");
        return "";
    }

    const subject = messageSpans[0].innerText;
    console.log("SafeSpace subject:", subject);
    return subject;
}

function getEmailBody() {
    const bodyContainer = document.querySelector('div[data-test-id="mailMessageBodyContainer"]');

    if (!bodyContainer) {
        console.log("SafeSpace: No email body container found");
        return "";
    }

    const bodyElements = bodyContainer.querySelectorAll('div.x_elementToProof');

    if (bodyElements.length === 0) {
        console.log("SafeSpace: No email body elements found");
        return "";
    }

    let fullText = "";

    bodyElements.forEach(el => {
        // Yellow highlight helps debug which elements are being read
        el.style.backgroundColor = 'yellow';
        fullText += el.innerText + "\n";
    });

    console.log("SafeSpace body:", fullText);
    return fullText;
}

function getSenderName() {
    const senderSpan = document.querySelector('span.OZZZK');

    if (!senderSpan) {
        console.log("SafeSpace: No sender name found");
        return "";
    }

    console.log("SafeSpace sender:", senderSpan.innerText);
    return senderSpan.innerText;
}


addRecordingBanner();

setupSendButton();

setInterval(addReportButtons, 1500);