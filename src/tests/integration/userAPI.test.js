import axios from "axios";
import { getUsers, createUser } from "../../api/userAPI";

jest.mock("axios");

const API_URL = process.env.REACT_APP_API_URL || "https://jsonplaceholder.typicode.com/users";
const API_TOKEN = process.env.REACT_APP_API_TOKEN;

/**
 * Integration tests for userAPI
 * Tests API interactions with mocked axios
 * Covers success cases (200/201), business errors (400), and server crashes (500)
 */
describe("userAPI - Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUsers", () => {
    /**
     * Test: Successful GET request (200)
     * Should return list of users from JSONPlaceholder
     */
    test("should retrieve users successfully on 200 response", async () => {
      const mockUsers = [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          birthDate: "1990-01-01",
          postalCode: "75001",
          city: "Paris",
        },
        {
          id: 2,
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
          birthDate: "1992-05-15",
          postalCode: "75002",
          city: "Paris",
        },
      ];

      axios.get.mockResolvedValueOnce({ status: 200, data: mockUsers });

      const result = await getUsers();

      expect(result).toEqual(mockUsers);
      expect(axios.get).toHaveBeenCalledWith(API_URL, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    /**
     * Test: Server crash (500)
     * Should throw SERVER_ERROR without crashing the app
     */
    test("should throw SERVER_ERROR on 500 response", async () => {
      const error = new Error("Server Error");
      error.response = { status: 500 };

      axios.get.mockRejectedValueOnce(error);

      await expect(getUsers()).rejects.toThrow("SERVER_ERROR");
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    /**
     * Test: Server crash (503)
     * Should throw SERVER_ERROR for service unavailable
     */
    test("should throw SERVER_ERROR on 503 response", async () => {
      const error = new Error("Service Unavailable");
      error.response = { status: 503 };

      axios.get.mockRejectedValueOnce(error);

      await expect(getUsers()).rejects.toThrow("SERVER_ERROR");
    });

    /**
     * Test: Network error
     * Should throw SERVER_ERROR for network failures
     */
    test("should throw SERVER_ERROR on network error", async () => {
      const error = new Error("Network Error");
      error.response = undefined;

      axios.get.mockRejectedValueOnce(error);

      await expect(getUsers()).rejects.toThrow("SERVER_ERROR");
    });
  });

  describe("createUser", () => {
    const newUser = {
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@example.com",
      birthDate: "1995-03-20",
      postalCode: "75003",
      city: "Paris",
      timestamp: "2024-02-20T10:00:00.000Z",
    };

    /**
     * Test: Successful user creation (201)
     * Should return created user data with API-generated ID
     */
    test("should create user successfully on 201 response", async () => {
      const mockCreatedUser = {
        id: 11,
        ...newUser,
      };

      axios.post.mockResolvedValueOnce({ data: mockCreatedUser, status: 201 });

      const result = await createUser(newUser);

      expect(result).toEqual(mockCreatedUser);
      expect(axios.post).toHaveBeenCalledWith(
        API_URL,
        newUser,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    /**
     * Test: Successful user creation (200)
     * Should handle 200 response as successful creation
     */
    test("should create user successfully on 200 response", async () => {
      const mockCreatedUser = {
        id: 11,
        ...newUser,
      };

      axios.post.mockResolvedValueOnce({ data: mockCreatedUser, status: 200 });

      const result = await createUser(newUser);

      expect(result).toEqual(mockCreatedUser);
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    /**
     * Test: Business error - Email already exists (400)
     * Should throw EMAIL_EXISTS error with specific message
     */
    test("should throw EMAIL_EXISTS error on 400 response", async () => {
      const error = new Error("Bad Request");
      error.response = {
        status: 400,
        data: { message: "Cet email est déjà utilisé" },
      };

      axios.post.mockRejectedValueOnce(error);

      await expect(createUser(newUser)).rejects.toThrow("Cet email est déjà utilisé");
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    /**
     * Test: Business error - No custom message (400)
     * Should throw default EMAIL_EXISTS message
     */
    test("should throw EMAIL_EXISTS with default message on 400 response without message", async () => {
      const error = new Error("Bad Request");
      error.response = {
        status: 400,
        data: {},
      };

      axios.post.mockRejectedValueOnce(error);

      await expect(createUser(newUser)).rejects.toThrow("EMAIL_EXISTS");
    });

    /**
     * Test: Server crash (500)
     * Should throw SERVER_ERROR without crashing the app
     */
    test("should throw SERVER_ERROR on 500 response", async () => {
      const error = new Error("Server Error");
      error.response = { status: 500 };

      axios.post.mockRejectedValueOnce(error);

      await expect(createUser(newUser)).rejects.toThrow("SERVER_ERROR");
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    /**
     * Test: Server crash (502)
     * Should throw SERVER_ERROR for bad gateway
     */
    test("should throw SERVER_ERROR on 502 response", async () => {
      const error = new Error("Bad Gateway");
      error.response = { status: 502 };

      axios.post.mockRejectedValueOnce(error);

      await expect(createUser(newUser)).rejects.toThrow("SERVER_ERROR");
    });

    /**
     * Test: Server crash (503)
     * Should throw SERVER_ERROR for service unavailable
     */
    test("should throw SERVER_ERROR on 503 response", async () => {
      const error = new Error("Service Unavailable");
      error.response = { status: 503 };

      axios.post.mockRejectedValueOnce(error);

      await expect(createUser(newUser)).rejects.toThrow("SERVER_ERROR");
    });

    /**
     * Test: Network error during POST
     * Should throw SERVER_ERROR for network failures
     */
    test("should throw SERVER_ERROR on network error", async () => {
      const error = new Error("Network Error");
      error.response = undefined;

      axios.post.mockRejectedValueOnce(error);

      await expect(createUser(newUser)).rejects.toThrow("SERVER_ERROR");
    });

    /**
     * Test: Client error (other than 400)
     * Should throw SERVER_ERROR for unexpected client errors
     */
    test("should throw SERVER_ERROR on unexpected 4xx error", async () => {
      const error = new Error("Unprocessable Entity");
      error.response = { status: 422 };

      axios.post.mockRejectedValueOnce(error);

      await expect(createUser(newUser)).rejects.toThrow("SERVER_ERROR");
    });
  });
});
