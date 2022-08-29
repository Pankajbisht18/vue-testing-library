import SignUpPage from './SignUp.vue';
import { render, screen } from '@testing-library/vue';
import "@testing-library/jest-dom";
import userEvent from '@testing-library/user-event'
import axios from 'axios';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

describe("Sign Up Page", () => {
    describe("Layout", () => {
        it("has Sign Up header", () => {
            render(SignUpPage);
            const header = screen.queryByRole("heading", { name: "Sign Up" });
            expect(header).toBeInTheDocument();
        });
        it("has username input", () => {
            render(SignUpPage)
            const input = screen.queryByLabelText("Username");
            expect(input).toBeInTheDocument();
        })
        it("has email input", () => {
            render(SignUpPage)
            const input = screen.queryByLabelText("E-mail");
            expect(input).toBeInTheDocument();
        })
        it("has password input", () => {
            render(SignUpPage)
            const input = screen.queryByLabelText("Password");
            expect(input).toBeInTheDocument();
        })
        it("has password type for password input", () => {
            render(SignUpPage)
            const input = screen.queryByLabelText("Password");
            expect(input.type).toBe("password");
        })
        it("has password repeat input", () => {
            render(SignUpPage)
            const input = screen.queryByLabelText("Password-Repeat");
            expect(input).toBeInTheDocument();
        })
        it("has password repeat type for password input", () => {
            render(SignUpPage)
            const input = screen.queryByLabelText("Password-Repeat");
            expect(input.type).toBe("password");
        })
        it("has Sign Up Button", () => {
            render(SignUpPage);
            const button = screen.queryByRole("button", { name: "Sign Up" });
            expect(button).toBeInTheDocument();
        });
        it("disables the button initially", () => {
            render(SignUpPage);
            const button = screen.queryByRole("button", { name: "Sign Up" });
            expect(button).toBeDisabled();
        });
    });
    describe('Interactions', () => {
        it("enables the button when the password and password repeat fileds have same value", async () => {
            render(SignUpPage);
            const passwordInput = screen.queryByLabelText("Password");
            const passwordRepeatInput = screen.queryByLabelText("Password-Repeat");
            await userEvent.type(passwordInput, "P4ssword");
            await userEvent.type(passwordRepeatInput, "P4ssword");
            const button = screen.queryByRole("button", {name: "Sign Up"});
            expect(button).toBeEnabled();
        });
        it("sends username, email and password to backend after clicking the button", async () => {
            let requestBody;
            const server = setupServer(
                rest.post("/api/1.0/users/", (req, res, ctx) => {
                    console.log(req)
                    requestBody = req.bodyUsed;
                    return res(ctx.status(200));
                })
            );
            server.listen();
            render(SignUpPage);
            const usernameInput = screen.queryByLabelText("Username");
            const emailInput = screen.queryByLabelText("E-mail");
            const passwordInput = screen.queryByLabelText("Password");
            const passwordRepeatInput = screen.queryByLabelText("Password-Repeat");
            await userEvent.type(usernameInput, "user1");
            await userEvent.type(emailInput, "user1@gmail.com");
            await userEvent.type(passwordInput, "P4ssword");
            await userEvent.type(passwordRepeatInput, "P4ssword");
            const button = screen.queryByRole("button", {name: "Sign Up"});

            // const mockFn = jest.fn();
            // axios.post = mockFn;

            await userEvent.click(button);

            await server.close();

            // const firstCall = mockFn.mock.calls[0]
            // const body = firstCall[1]

            expect(requestBody).toEqual({
                username: 'user1',
                email: "user1@gmail.com",
                password: "P4ssword",
            })
        });
    })
})