<script>
    import {slide} from 'svelte/transition';
    let show = true;
</script>

{#if show}
    <div class="container" transition:slide>
        <div class="HomeElement">
            <div class="profile-photo">
                <img src="./assets/photo!!.png" alt="" />
            </div>
            <div class="profile-text">
                <h1>Hi I'm Ragu</h1>
                <br /> <br />
                <p>
                    <br />An enthusiastic Data Analyst, with a strong passion
                    for uncovering meaningful insights through the application
                    of data science techniques.
                </p>

                <div class="btn-group">
                    <a href="./assets/Resume.pdf" class="btn active"
                        >Download CV</a
                    >
                    <a href="mailto:https.ragu@gmail.com" class="btn">Contact</a
                    >
                </div>

                <div class="social">
                    <a href="mailto:https.ragu@gmail.com" aria-label="Send an email to Ragu">
                        <i class="fa fa-envelope"></i>
                    </a>
                    <a href="https://github.com/ragu8" aria-label="Visit Ragu's GitHub profile">
                        <i class="fa-brands fa-github"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/ragu8/" aria-label="Visit Ragu's LinkedIn profile">
                        <i class="fa-brands fa-linkedin"></i>
                    </a>
                    
                </div>
            </div>
        </div>
    </div>
{/if}

<style lang="scss">
    .HomeElement {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 9.5rem 0rem;
        @media (max-width: 1050px) {
            flex-direction: column;
            padding-top: 2rem;
        }
    }

    .HomeElement .profile-photo {
        width: 450px;
        height: 450px;
        border-radius: 50%;
        overflow: hidden;
        border: 15px solid #444444;
        box-shadow: 5px 7px 25px rgba(0, 0, 0, 0.5);
        @media only screen and (max-width: 767px) {
            width: 350px;
            height: 350px;
        }
    }
    .profile-photo img {
        height: 100%;
        width: 100%;
        transition: 0.8s;
    }

    .HomeElement .profile-photo img:hover {
        transform: scale(1.2);
    }
    .profile-text {
        max-width: 650px;
        display: flex;
        flex-direction: column;
        @media (max-width: 1050px) {
            padding: 40px 0px;
        }
        @media only screen and (max-width: 767px) {
            width: 350px;
        }
    }

    .profile-text h1 {
        color: #fed700;
        font-size: 3.5rem;
    }

    .profile-text p {
        font-size: 1.2rem;
        color: #e5e5e5;
    }
    .profile-text .social i {
        color: #e5e5e5;
        font-size: 25px;
        margin-right: 10px;
        transition: 0.5s;
    }
    .profile-text .social i:hover {
        color: #fed700;
        transform: rotate(360deg);
    }

    .btn-group {
        margin: 45px 0;
    }
    .btn-group .btn {
        border-color: #d5d5d5;
        color: #fff;
        background-color: #333;
        padding: 12px 25px;
        margin: 5px 0;
        margin-right: 7px;
        border-radius: 30px;
        border: 2px solid #e5e5e5;
        box-shadow: 0 10px 10px -8px rgb(0 0 0 / 78%);
    }
    .btn.active {
        border-color: #fed700;
    }

    @media only screen and (max-width: 767px) {
        .HomeElement .profile-text p {
            text-align: justify;
        }
    }
</style>
