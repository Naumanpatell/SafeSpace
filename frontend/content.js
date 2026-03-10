function addRecordingBanner() {
    // Prevent duplicate banners if function runs multiple times
    if (document.getElementById("safeSpaceBanner")) return;

    const banner = document.createElement("div");
    banner.id = "safeSpaceBanner";
    banner.innerText = "⚠️ SafeSpace: Your email is being checked";

    banner.style.position = "fixed";
    banner.style.top = "0";
    banner.style.left = "0";
    banner.style.width = "100%";
    banner.style.backgroundColor = "red";
    banner.style.color = "white";
    banner.style.fontSize = "12px";
    banner.style.fontWeight = "bold";
    banner.style.textAlign = "center";
    banner.style.padding = "4px";
    banner.style.zIndex = "9999";

    document.body.appendChild(banner);
    document.body.style.paddingTop = "22px";
}

function showOffensivePopup(classification, confidence) {
    // Prevent duplicate popups
    if (document.getElementById("safeSpacePopup")) return;

    // Dark overlay behind the popup
    const overlay = document.createElement("div");
    overlay.id = "safeSpacePopup";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "10000";

    // White popup box
    const popup = document.createElement("div");
    popup.style.backgroundColor = "white";
    popup.style.padding = "20px";
    popup.style.borderRadius = "8px";
    popup.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
    popup.style.textAlign = "center";
    popup.style.maxWidth = "400px";
    popup.style.fontFamily = "Arial, sans-serif";

    // Show AI classification (toxic/racist/sexist) and confidence %
    popup.innerHTML = `
        <h2 style="color:red;">⚠️ Offensive Content Detected</h2>
        <p>Your email has been classified as 
            <strong style="color:red; text-transform:uppercase;">${classification}</strong>
        </p>
        <p>AI Confidence: <strong>${(confidence * 100).toFixed(1)}%</strong></p>
        <p>Please rephrase your email before sending.</p>
    `;

    const cancelBtn = document.createElement("button");
    cancelBtn.innerText = "Edit Email";
    cancelBtn.style.padding = "8px 16px";
    cancelBtn.style.marginTop = "10px";
    cancelBtn.style.backgroundColor = "red";
    cancelBtn.style.color = "white";
    cancelBtn.style.border = "none";
    cancelBtn.style.borderRadius = "4px";
    cancelBtn.style.cursor = "pointer";

    // Remove popup when user clicks Edit Email
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
        // Yellow highlight so user knows SafeSpace is watching this button
        sendButton.style.setProperty("background-color", "yellow", "important");

        // Remove old listener first to avoid attaching duplicates
        sendButton.removeEventListener("click", handleSendClick);
        sendButton.addEventListener("click", handleSendClick);

        console.log("SafeSpace: Send button interceptor attached");
    } else {
        // Button not found yet — retry in 500ms
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
        reportBtn.innerText = "Report";
        reportBtn.setAttribute("aria-label", "Report Email");

        // Orange styling to stand out from Outlook buttons
        reportBtn.style.marginLeft = "6px";
        reportBtn.style.padding = "6px 10px";
        reportBtn.style.backgroundColor = "orange";
        reportBtn.style.color = "black";
        reportBtn.style.border = "none";
        reportBtn.style.borderRadius = "4px";
        reportBtn.style.cursor = "pointer";
        reportBtn.style.fontWeight = "bold";

        reportBtn.addEventListener("click", () => {
            console.log("SafeSpace: Report button clicked");

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
    const popup = document.createElement("div");

    popup.innerText = "This email has been flagged and reported through SafeSpace. Our system will review the content to ensure communication remains respectful and professional.";

    // Toast style — fixed in top right corner
    popup.style.position = "fixed";
    popup.style.top = "20px";
    popup.style.right = "20px";
    popup.style.padding = "16px";
    popup.style.backgroundColor = "#323130";
    popup.style.color = "white";
    popup.style.borderRadius = "6px";
    popup.style.zIndex = "9999";
    popup.style.fontSize = "14px";
    popup.style.maxWidth = "320px";
    popup.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";

    document.body.appendChild(popup);

    // Auto remove after 5 seconds
    setTimeout(() => popup.remove(), 5000);
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