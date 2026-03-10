// -----------------------------
// SAFESPACE BANNER
// -----------------------------
function addRecordingBanner() {
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

// -----------------------------
// OFFENSIVE POPUP
// -----------------------------
function showOffensivePopup() {
    if (document.getElementById("safeSpacePopup")) return;

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

    const popup = document.createElement("div");
    popup.style.backgroundColor = "white";
    popup.style.padding = "20px";
    popup.style.borderRadius = "8px";
    popup.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
    popup.style.textAlign = "center";
    popup.style.maxWidth = "400px";
    popup.style.fontFamily = "Arial, sans-serif";

    popup.innerHTML = `
        <h2 style="color:red;">⚠️ Offensive Content Detected</h2>
        <p>Please rephrase your email before sending.</p>
    `;

    const cancelBtn = document.createElement("button");
    cancelBtn.innerText = "Cancel";
    cancelBtn.style.padding = "8px 16px";
    cancelBtn.style.marginTop = "10px";
    cancelBtn.style.backgroundColor = "red";
    cancelBtn.style.color = "white";
    cancelBtn.style.border = "none";
    cancelBtn.style.borderRadius = "4px";
    cancelBtn.style.cursor = "pointer";

    cancelBtn.addEventListener("click", () => overlay.remove());

    popup.appendChild(cancelBtn);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

// -----------------------------
// GET EMAIL CONTENT
// -----------------------------
function getEmailContent() {
    const subjectField = document.querySelector('input[aria-label="Subject"]');
    const bodyDiv = document.querySelector('div.elementToProof');

    const subject = subjectField ? subjectField.value : "";
    const body = bodyDiv ? bodyDiv.innerText : "";

    const fullEmail = `Subject: ${subject}\n\n${body}`;
    console.log("SafeSpace captured email:");
    console.log(fullEmail);

    sendToBackend(fullEmail);
}

// -----------------------------
// SEND TO BACKEND
// -----------------------------
let sendBlocked = false; // prevent multiple clicks

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
            if (data.offensive) {
                showOffensivePopup();
                sendBlocked = false; // allow user to rephrase
            } else {
                actuallySendEmail(sendButton);
            }
        })
        .catch(err => {
            console.error("Backend error:", err);
            sendBlocked = false;
        });
}

// -----------------------------
// ACTUALLY SEND EMAIL
// -----------------------------
function actuallySendEmail(sendButton) {
    if (!sendButton) return;

    sendButton.removeEventListener("click", handleSendClick);

    sendButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    sendButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    sendButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    setupSendButton();
}

// -----------------------------
// SEND BUTTON CLICK HANDLER
// -----------------------------
function handleSendClick(event) {
    const sendButton = event.currentTarget;
    if (!sendBlocked) {
        event.preventDefault();
        event.stopPropagation();

        sendBlocked = true;
        getEmailContent();
    } else {
        event.preventDefault();
        event.stopPropagation();
    }
}

// -----------------------------
// SETUP SEND BUTTON
// -----------------------------
function setupSendButton() {
    const sendButton = document.querySelector('button[aria-label="Send"]');

    if (sendButton) {
        sendButton.style.setProperty("background-color", "yellow", "important");

        sendButton.removeEventListener("click", handleSendClick);
        sendButton.addEventListener("click", handleSendClick);

        console.log("SafeSpace: Send button ready");
    } else {
        setTimeout(setupSendButton, 500);
    }
}


function highlightForwardButtons() {

    const forwardButtons = document.querySelectorAll('button[aria-label="Forward"]');

    forwardButtons.forEach(button => {

        button.style.backgroundColor = "yellow";
        button.style.color = "black";

        if (document.getElementById("safeSpaceReportBtn")) return;

        const reportBtn = document.createElement("button");
        reportBtn.id = "safeSpaceReportBtn";
        reportBtn.innerText = "Report";

        reportBtn.style.marginLeft = "6px";
        reportBtn.style.padding = "6px 10px";
        reportBtn.style.backgroundColor = "orange";
        reportBtn.style.color = "black";
        reportBtn.style.border = "none";
        reportBtn.style.borderRadius = "4px";
        reportBtn.style.cursor = "pointer";
        reportBtn.style.fontWeight = "bold";

        reportBtn.addEventListener("click", () => {

            // -----------------------------
            // GET SENDER NAME
            // -----------------------------
            const senderElement = document.querySelector('[aria-label^="From:"]');
            const sender = senderElement ? senderElement.innerText : "Unknown Sender";

            // -----------------------------
            // GET SUBJECT
            // -----------------------------
            const subjectField = document.querySelector('input[aria-label="Subject"]');
            const subject = subjectField ? subjectField.value : "(No Subject)";

            // -----------------------------
            // GET EMAIL BODY
            // -----------------------------
            const bodyElements = document.querySelectorAll(".elementToProof, .x_elementToProof");

            let body = "";

            if (bodyElements.length > 0) {
                bodyElements.forEach(el => {
                    body += el.innerText + "\n";
                });
            } else {
                // fallback for opened email view
                const messageBody = document.querySelector('[role="document"]');
                body = messageBody ? messageBody.innerText : "";
            }

            // -----------------------------
            // BUILD EMAIL DATA
            // -----------------------------
            const emailData = `
Sender: ${sender}
Subject: ${subject}

${body}
`;

            console.log("📨 Email reported:");
            console.log(emailData, 111);



        });

        button.parentElement.appendChild(reportBtn);
    });
}


function addReportButtons() {

    const forwardButtons = document.querySelectorAll('button[aria-label="Forward"]');

    forwardButtons.forEach(forwardBtn => {

        // Avoid adding duplicate report buttons
        if (forwardBtn.nextElementSibling && forwardBtn.nextElementSibling.id === "safeSpaceReportBtn") {
            return;
        }

        const reportBtn = document.createElement("button");
        reportBtn.id = "safeSpaceReportBtn";
        reportBtn.type = "button";
        reportBtn.innerText = "Report";
        reportBtn.setAttribute("aria-label", "Report Email");

        // Simple styling
        reportBtn.style.marginLeft = "6px";
        reportBtn.style.padding = "6px 10px";
        reportBtn.style.backgroundColor = "orange";
        reportBtn.style.color = "black";
        reportBtn.style.border = "none";
        reportBtn.style.borderRadius = "4px";
        reportBtn.style.cursor = "pointer";
        reportBtn.style.fontWeight = "bold";


        reportBtn.addEventListener("click", () => {
            console.log("report button has been clicked!");

            const subject = getEmailSubject();
            const body = getEmailBody();
            const sender = getSenderName();

            console.log("📤 Payload:", { sender, subject, body });

            fetch("http://127.0.0.1:8000/report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sender: sender,
                    subject: subject,
                    body: body
                })
            })
                .then(res => res.json())
                .then(data => {
                    console.log("Report response:", data);
                    showReportPopup();
                })
                .catch(err => {
                    console.error("Report error:", err);
                });
        });

        // Insert after Forward button
        forwardBtn.parentNode.insertBefore(reportBtn, forwardBtn.nextSibling);
    });
}
function showReportPopup() {

    const popup = document.createElement("div");

    popup.innerText =
        "This email has been flagged and reported through SafeSpace. Our system will review the content to ensure communication remains respectful and professional.";

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

    setTimeout(() => popup.remove(), 5000);
}

// -----------------------------
// DEBUG HIGHLIGHT MESSAGE TEXT
// -----------------------------

function getEmailSubject() {

    const messageSpans = document.querySelectorAll("span.JdFsz");

    if (messageSpans.length === 0) {
        console.log("SafeSpace DEBUG: No message spans found");
        return;
    }

    messageSpans.forEach((span, index) => {

        const spanText = span.innerText;

        // span.style.backgroundColor = "yellow";
        // span.style.color = "black";
        // span.style.padding = "2px 4px";
        // span.style.borderRadius = "3px";

        // console.log("SafeSpace DEBUG: Span", index);
        console.log("SafeSpace DEBUG Subject:", span.innerHTML);
        // console.log("Element:", span);
        return spanText;

    });

}

function getEmailBody() {
    const bodyContainer = document.querySelector('div[data-test-id="mailMessageBodyContainer"]');

    if (!bodyContainer) {
        console.log("SafeSpace DEBUG: No email body container found");
        return "";
    }

    const bodyElements = bodyContainer.querySelectorAll('div.x_elementToProof');

    if (bodyElements.length === 0) {
        console.log("SafeSpace DEBUG: No email body elements found");
        return "";
    }

    let fullText = "";

    bodyElements.forEach((el, index) => {
        el.style.backgroundColor = 'yellow';
        // el.style.borderRadius = '3px';
        // el.style.padding = '2px 4px';
        // console.log("SafeSpace DEBUG: Found email body element", index, el);
        // console.log("SafeSpace DEBUG: Text content:", el.innerText);
        fullText += el.innerText + "\n";
    });

    console.log("SafeSpace DEBUG Body: ", fullText);
    return fullText;
}


function getSenderName() {
    const senderSpan = document.querySelector('span.OZZZK');

    if (!senderSpan) {
        console.log("SafeSpace DEBUG: No sender name found");
        return "";
    }

    // console.log("SafeSpace DEBUG: Sender name element:", senderSpan);
    console.log("SafeSpace DEBUG: Sender name text:", senderSpan.innerText);

    return senderSpan.innerText;
}


// Run repeatedly because Outlook loads elements dynamically
setInterval(addReportButtons, 1500);
// setInterval(highlightForwardButtons, 2000);

// -----------------------------
// START EXTENSION
// -----------------------------
addRecordingBanner();
setupSendButton();
// setTimeout(addReportButton, 1000); // add after toolbar renders
// setTimeout(highlightReplyForward, 1000);

// Run immediately
// highlightForwardButtons();

// Keep checking because Outlook loads buttons dynamically
// setInterval(highlightForwardButtons, 1000);