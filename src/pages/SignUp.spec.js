import SignUpPage from './SignUp.vue';
import { render, screen } from '@testing-library/vue';
import "@testing-library/jest-dom";
import userEvent from '@testing-library/user-event'
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

        const setup = async() => {
            render(SignUpPage);
            const usernameInput = screen.queryByLabelText("Username");
            const emailInput = screen.queryByLabelText("E-mail");
            const passwordInput = screen.queryByLabelText("Password");
            const passwordRepeatInput = screen.queryByLabelText("Password-Repeat");
            await userEvent.type(usernameInput, "user1");
            await userEvent.type(emailInput, "user1@gmail.com");
            await userEvent.type(passwordInput, "P4ssword");
            await userEvent.type(passwordRepeatInput, "P4ssword");
        }

        it("enables the button when the password and password repeat fileds have same value", async () => {
            await setup();
            const button = screen.queryByRole("button", {name: "Sign Up"});
            expect(button).toBeEnabled();
        });
        it("sends username, email and password to backend after clicking the button", async () => {
            let requestBody;
            const server = setupServer(
                rest.post('/api/1.0/users', (req, res, ctx) => {
                    requestBody = req.body;
                    return res(ctx.status(200));
                })
            );
            server.listen();
            await setup();
            const button = screen.queryByRole("button", {name: "Sign Up"});

            await userEvent.click(button);
            await server.close();
            
            expect(requestBody).toEqual({
                username: 'user1',
                email: "user1@gmail.com",
                password: "P4ssword",
            })
        });

        it("does not allow clicking to the button when there is an ongoing api call", async () => {
            let counter = 0;
            const server = setupServer(
                rest.post('/api/1.0/users', (req, res, ctx) => {
                    counter++
                    return res(ctx.status(200));
                })
            );
            server.listen();
            await setup();
            const button = screen.queryByRole("button", {name: "Sign Up"});

            await userEvent.click(button);
            await userEvent.click(button);
            await server.close();
            
            expect(counter).toBe(1);
        });

        it("displays spinner while the api request in progress", async () => {
            const server = setupServer(
                rest.post("/api/1.0/users", (req, res, ctx) => {
                    return res(ctx.status(200));
                })
            );
            server.listen();
            await setup();

            const button = screen.queryByRole("button", { name: "Sign Up" });

            await userEvent.click(button);

            const spinner = screen.queryByRole("status");
            expect(spinner).toBeInTheDocument();
        })

        it("does not display spinner when there is no api request", async () => {
           await setup();
           const spinner = screen.queryByRole("status");
           expect(spinner).not.toBeInTheDocument(); 
        })

        it("displays account activation information after successful sign up", async () => {
            const server = setupServer(
                rest.post("/api/1.0/users", (req, res, ctx) => {
                    return res(ctx.status(200));
                })
            );
            server.listen();
            await setup();

            const button = screen.queryByRole("button", { name: "Sign Up" });

            await userEvent.click(button);

            const text = await screen.findByText("Please check your e-mail to activate your account");
            expect(text).toBeInTheDocument();
        })

        it("does not display account activation message before sign up request", async () => {
            await setup();

            const text = screen.queryByText("Please check your e-mail to activate your account")

            expect(text).not.toBeInTheDocument();
        })

        it("doen not displays account activation information after failing sign up", async () => {
            const server = setupServer(
                rest.post("/api/1.0/users", (req, res, ctx) => {
                    return res(ctx.status(400));
                })
            );
            server.listen();
            await setup();

            const button = screen.queryByRole("button", { name: "Sign Up" });

            await userEvent.click(button);

            const text = await screen.queryByText ("Please check your e-mail to activate your account");
            expect(text).toBeInTheDocument();
        })
    })
})