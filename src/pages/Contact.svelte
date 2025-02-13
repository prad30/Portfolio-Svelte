<script>
    import { fade } from "svelte/transition";
    let show = true;

    let name = "";
    let email = "";
    let message = "";
    let msg = "";

    const scriptURL =
        "process.env.VITE_script_URL";

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("message", message);

        try {
            const response = await fetch(scriptURL, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                msg = "Message sent successfully";
                setTimeout(() => {
                    msg = "";
                }, 5000);

                name = "";
                email = "";
                message = "";
            } else {
                msg = "Error: Unable to send message";
            }
        } catch (error) {
            console.error("Error!", error.message);
            msg = "Error: Unable to send message";
        }
    };
</script>

{#if show}
    <div class="container" transition:fade>
        <section class="contact-content">
            <div class="contact-title">
                <h4>CONTACT ME</h4>
                <p>let's turn data into magic!</p>
            </div>
            <div class="social">
                <a
                    href="mailto:https.ragu@gmail.com"
                    aria-label="Send an email to Ragu"
                >
                    <i class="fa fa-envelope"></i>
                </a>
                <a
                    href="https://github.com/ragu8"
                    aria-label="Visit Ragu's GitHub profile"
                >
                    <i class="fa-brands fa-github"></i>
                </a>
                <a
                    href="https://www.linkedin.com/in/ragu8/"
                    aria-label="Visit Ragu's LinkedIn profile"
                >
                    <i class="fa-brands fa-linkedin"></i>
                </a>
            </div>

            <div class="contact">
                <form id="contact-form" on:submit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        required
                    />
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        rows="5"
                        required
                    ></textarea>
                    <button type="submit" class="submit">Send Message</button>
                    {#if msg}
                        <p class={msg.includes("Error") ? "error" : "msg"} id="msg">
                            {msg}
                        </p>
                    {/if}
                </form>
            </div>
        </section>
    </div>
{/if}

<style lang="scss">
    .contact-content {
        padding: 90px 0;
        color: #fff;
        text-align: center;
        @media only screen and (max-width: 767px) {
            padding: 25px 0px;
        }
    }
    .contact-content .contact-title h4 {
        font-size: 40px;
        text-transform: capitalize;
        color: #fed700;
        padding-bottom: 15px;
        margin-bottom: 20px;
        @media only screen and (max-width: 767px) {
            font-size: 25px;
            padding-bottom: 10px;
        }
    }
    .contact-content .contact-title p {
        padding-bottom: 20px;
    }
    .contact {
        padding: 40px 0px;
        max-width: 550px;
        margin: auto;
    }

    .contact input,
    .contact textarea {
        font-size: 15px;
        color: #202020;
        width: 100%;
        padding: 15px;
        border: 0;
        margin-bottom: 20px;
        border: 3px solid;
        border-radius: 10px;
        outline: none;
        background-color: #f6ecb3;
        &:hover {
            border-color: rgb(252, 226, 76);
        }
    }

    .contact .submit {
        width: auto;
        background-color: #fed700;
        padding: 10px 40px;
        font-weight: bold;
        font-size: 18px;
        border: none;
        border-radius: 30px;
        transition: 0.2s;
        &:hover {
            transform: scale(1.1);
            cursor: pointer;
        }
    }
    #msg {
        color: #fff;
        font-size: 20px;
        margin-top: 10px;
        display: block;
    }
</style>
