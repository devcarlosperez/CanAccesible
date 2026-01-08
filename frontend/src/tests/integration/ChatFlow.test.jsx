import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChatWindow from "../../components/conversation/ChatWindow";
import * as socketIo from "socket.io-client";
import axios from "axios";

// Mock external dependencies: socket.io, axios, and toast notifications
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

vi.mock("axios");

vi.mock("socket.io-client", () => ({
  default: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn() },
}));

// Simulate local storage usage for token handling
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

Element.prototype.scrollIntoView = vi.fn();

describe("Integration Test: Chat Flow (CRUD)", () => {
  let mockSocket;

  const mockConversation = {
    id: "convo1",
    participants: [
      { id: "user1", name: "User 1", role: "user" },
      { id: "admin2", name: "Admin 1", role: "admin" },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Initialize mocks and set up a valid user token
    const socketDummy = {
      on: vi.fn(),
      emit: vi.fn(),
      off: vi.fn(),
      disconnect: vi.fn(),
    };
    socketIo.default.mockReturnValue(socketDummy);
    mockSocket = socketDummy;

    axios.get = vi.fn().mockResolvedValue({ data: [] });

    const tokenPayload = btoa(JSON.stringify({ id: "user1", role: "user" }));
    localStorage.setItem("token", `header.${tokenPayload}.signature`);
  });

  // Simulate user typing and sending a message via socket event
  it("should allow a user to type and send a message via socket", async () => {
    render(<ChatWindow conversation={mockConversation} />);

    const input = screen.getByPlaceholderText("chat_placeholder");
    fireEvent.change(input, { target: { value: "Hello World" } });
    expect(input.value).toBe("Hello World");

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[buttons.length - 1]);

    expect(mockSocket.emit).toHaveBeenCalledWith(
      "sendMessage",
      expect.objectContaining({
        conversationId: "convo1",
        message: "Hello World",
      })
    );

    expect(input.value).toBe("");
  });
});
