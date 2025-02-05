<script>
    import {fade} from 'svelte/transition';
let show =true;
</script>
{#if show}
<section class="contact-content" transition:fade>
<div class="container">
    <div class="contact-title">
        <h4>Contact Me</h4>
        <p>Get In Touch</p>
    </div>
    <div class="social">
        <a href="mailto:https.ragu@gmail.com"
            ><i class="fa fa-envelope"></i></a
        >
        <a href="https://github.com/ragu8"
            ><i class="fa-brands fa-github"></i></a
        >
        <a href="https://www.linkedin.com/in/ragu8/"
            ><i class="fa-brands fa-linkedin"></i></a
        >
    </div>

    <div class="contact">
        <form id="contact-form" method="POST">
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
            <span id="msg"></span>
            <!-- Message after form submission -->
        </form>
    </div>
</div>
</section>

{/if}

<style lang="scss">
.contact-content {
    padding: 120px 0;
    color: #fff;
    text-align: center;
}
.contact-content .contact-title h4 {
    font-size: 50px;
    text-transform: capitalize;
    color: #fed700;
    padding-bottom: 15px;
}
.contact-content .contact-title p {
    padding-bottom: 20px;
}
.contact {
    padding: 40px 0px;
    max-width: 800px;
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
    margin-top: -8px;
    display: block;
}
</style>
