import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChatWindow from "../../components/conversation/ChatWindow";
import * as socketIo from "socket.io-client";
import axios from "axios";

// Mock i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock axios
vi.mock("axios");

// Mock socket.io-client
vi.mock("socket.io-client", () => ({
  default: vi.fn()
}));

// Mock toast
vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  }
}));

// Mock environment variables
vi.stubGlobal('import.meta', {
    env: { VITE_API_URL: 'http://localhost:3000' }
});

// Helper to mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key) => { delete store[key]; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe("Integration Test: Chat Flow (CRUD)", () => {
    let mockSocket;

    const mockConversation = {
        id: "convo1",
        participants: [
            { id: "user1", name: "User 1", role: "user" },
            { id: "admin2", name: "Admin 1", role: "admin" }
        ]
    };

    beforeEach(() => {
        vi.clearAllMocks();
        
        // Setup socket dummy
        const socketDummy = {
            on: vi.fn(),
            emit: vi.fn(),
            off: vi.fn(),
            disconnect: vi.fn(),
        };
        socketIo.default.mockReturnValue(socketDummy);
        mockSocket = socketDummy;

        // Setup axios mock for messages load
        axios.get = vi.fn().mockResolvedValue({ data: [] });
        
        // Setup localStorage for user
        const tokenPayload = btoa(JSON.stringify({ id: "user1", role: "user" }));
        localStorage.setItem("token", `header.${tokenPayload}.signature`);
    });

    it("should allow a user to type and send a message, updating the UI", async () => {
        // 1. Initial Load (Empty)
        render(<ChatWindow conversation={mockConversation} />);
        
        // 2. Simulate User Typing
        const input = screen.getByPlaceholderText("chat_placeholder");
        fireEvent.change(input, { target: { value: "Hello World" } });
        expect(input.value).toBe("Hello World");
        
        // 3. Simulate Send Click
        // Based on previous analysis, we click the send button
        // In the real component, sendMessage emits socket event AND might update UI optimistically or wait for socket return.
        // Let's check the code: sendMessage calls socket.emit('sendMessage', ...).
        // It does NOT setMessages immediately in many designs, it waits for socket.on('newMessage')
        // However, looking at the code I read earlier:
        /*
        const sendMessage = async () => {
            if (!newMessage.trim() || !socket) return;
            // logic to emit
            socket.emit("sendMessage", payload);
            setNewMessage(""); // clears input
        };
        // and useEffect listening to "newMessage"
        useEffect(() => {
            if(!socket) return;
            socket.on("newMessage", (msg) => {
               setMessages((prev) => [...prev, msg]);
            });
        }, [socket]);
        */

        const sendButton = screen.getByRole("button", { name: "" }); // The button with the icon often has empty name if not aria-labeled.
        // Let's use class selector or check icon.
        // Actually, in RTL, we can use container.querySelector if needed, but role is better.
        // Let's try finding by class from previous file content `fa-paper-plane`.
        
        const buttons = screen.getAllByRole("button");
        const sendBtn = buttons[buttons.length - 1]; // Likely the last one
        
        fireEvent.click(sendBtn);

        // 4. Verify Socket Emission
        expect(mockSocket.emit).toHaveBeenCalledWith("sendMessage", expect.objectContaining({
            conversationId: "convo1",
            message: "Hello World"
        }));

        // 5. Verify Input Cleared (part of the Send flow)
        expect(input.value).toBe("");

        // 6. Simulate Socket "Reply" (Process Data Return)
        // We manually trigger the 'newMessage' handler that the component registered
        // The component calls socket.on("newMessage", handler)
        // We find that call in the mock and execute the callback
        const onNewMessageCall = mockSocket.on.mock.calls.find(call => call[0] === "newMessage");
        expect(onNewMessageCall).toBeDefined();
        
        const handler = onNewMessageCall[1];
        const incomingMessage = {
            id: 100,
            message: "Hello World",
            senderId: "user1",
            createdAt: new Date().toISOString()
        };
        
        // Act: specific to React state update
        await waitFor(() => {
             handler(incomingMessage);
        });

        // 7. Assert: Message is in the document
        expect(screen.getByText("Hello World")).toBeInTheDocument();
    });
});
