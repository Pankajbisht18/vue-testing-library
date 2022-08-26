import SignUpPage from './SignUp.vue';
import { render, screen } from '@testing-library/vue';
import "@testing-library/jest-dom";
import userEvent from '@testing-library/user-event'

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
            const Button = screen.queryByRole("button", { name: "Sign Up" });
            expect(Button).toBeInTheDocument();
        });
        it("has Sign Up Button disabled", () => {
            render(SignUpPage);
            const Button = screen.queryByRole("button", { name: "Sign Up" });
            expect(Button).toBeDisabled();
        });
    });
    describe('Interactions', () => {
        it("enables the button when the password and password repeat fileds have same value", async () => {
            render(SignUpPage);
            const passwordInput = screen.queryAllByLabelText("Password");
            const passwordRepeatInput = screen.queryAllByLabelText("password Repeat");
            await userEvent.type(passwordInput, "Password");
            await userEvent.type(passwordRepeatInput, "Password");
            const button = screen.queryAllByRole("button", {name: "Sign Up"});
            expect(button).toBeDisabled();
        })
    })
})