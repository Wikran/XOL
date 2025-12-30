<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Talking Chatbot</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 50px;
        }
        #chatbox {
            width: 300px;
            padding: 10px;
            border: 1px solid #ccc;
            margin: 10px auto;
            border-radius: 5px;
        }
        input {
            width: 80%;
            padding: 5px;
        }
        button {
            padding: 5px 10px;
        }
    </style>
</head>
<body>

    <h1>Talking Chatbot</h1>
    <div id="chatbox">
        <p><strong>Chatbot:</strong> Hello! Type something below.</p>
        <p id="chatOutput"></p>
        <input type="text" id="userInput" placeholder="Type a message...">
        <button id="sendBtn">Send</button>
    </div>

    <script>
        function speak(text) {
            let speech = new SpeechSynthesisUtterance(text);
            speech.lang = "en-US";
            speech.volume = 1;
            speech.rate = 1;
            speech.pitch = 1;
            window.speechSynthesis.speak(speech);
        }

        function chatbotResponse(userInput) {
            let response;
            if (userInput.toLowerCase().includes("hello")) {
                response = "Hello! How can I help you today?";
            } else if (userInput.toLowerCase().includes("how are you")) {
                response = "I'm just a chatbot, but I'm doing great! Thanks for asking.";
            } else {
                response = "Sorry, I didn't understand that.";
            }
            speak(response);
            document.getElementById("chatOutput").innerText = "Chatbot: " + response;
        }

        document.getElementById("sendBtn").addEventListener("click", function () {
            let userInput = document.getElementById("userInput").value;
            if (userInput.trim() !== "") {
                chatbotResponse(userInput);
                document.getElementById("userInput").value = ""; // Clear input
            }
        });

        // Allow pressing "Enter" to send message
        document.getElementById("userInput").addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                document.getElementById("sendBtn").click();
            }
        });
    </script>

</body>
</html>
