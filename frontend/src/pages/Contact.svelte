<script>
    import Socialicons from "../components/Socialicons.svelte";
    import { APP_SCRIPT_URL } from "../constants";

    let name = "";
    let subject = "";
    let message = "";
    let msg = "";

    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = `Name=${encodeURIComponent(name)}&Subject=${encodeURIComponent(subject)}&Message=${encodeURIComponent(message)}`;

        try {
            const response = await fetch(APP_SCRIPT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded" 
                },
                body: formData,
            });

            if (response.ok) {
                msg = "Message sent successfully";
                setTimeout(() => {
                    msg = "";
                }, 2000);

                name = "";
                subject = "";
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

<svelte:head>
    <title>Contact</title>
    <meta
        name="description"
        content="Get in touch with Ragupathi M, a data enthusiast specializing in analytics, machine learning, and operations research. Let's turn data into magic!"
    />
    <meta
        name="keywords"
        content="Contact, Ragupathy, Data Science, Machine Learning, Analytics, Operations Research, Predictive Modeling"
    />
    <meta property="og:url" content="https://ragu8.in/contact" />
</svelte:head>

<div class="container">
    <section class="contact-content">
        <div class="contact-title">
            <h4>CONTACT ME</h4>
            <p>let's turn data into magic!</p>
        </div>
        <Socialicons />
        <div class="contact">
            <form id="contact-form" on:submit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    required
                    bind:value={name}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Subject"
                    required
                    bind:value={subject}
                />
                <textarea
                    name="message"
                    placeholder="Message"
                    rows="5"
                    required
                    bind:value={message}
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
