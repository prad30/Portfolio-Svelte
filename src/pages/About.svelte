<script>
    import { fade } from "svelte/transition";
    let show = true;
</script>

{#if show}
    <div class="container" transition:fade>
        <section class="about-area">
            <div class="about">
                <div class="about-content">
                    <h4>About Me</h4>
                    <ul>
                        <li>
                            Extensive experience in developing and deploying
                            machine learning models, addressing a wide range of
                            business challenges.
                        </li>
                        <li>
                            Key contributor to a successful Proof-Of-Concept for
                            FinRL at Galaxy Technology Services.
                        </li>
                        <li>
                            Committed to continuous learning, staying updated
                            with the latest advancements in Data Science, and
                            expanding knowledge and skill sets
                        </li>
                    </ul>
                </div>

                <div class="about-skills">
                    <ul>
                        <li>👤 Name: Ragupathi M</li>
                        <li>🎂 Age: 22</li>
                        <li>🌍 From: Hosur 🇮🇳</li>
                        <li>📧 Email: https.ragu@gmail.com</li>
                        <li>
                            💼 Github: <a href="https://github.com/ragu8"
                                >https://github.com/ragu8</a
                            >
                        </li>
                        <li>
                            📊 Kaggle: <a href="https://www.kaggle.com/ragu08"
                                >https://www.kaggle.com/ragu08</a
                            >
                        </li>
                        <li>
                            🔗 LinkedIn: <a
                                href="https://www.linkedin.com/in/ragu8/"
                                >https://www.linkedin.com/ragu8</a
                            >
                        </li>
                        <li>⌛ Experience: 1yr</li>
                    </ul>
                </div>
            </div>
        </section>
    </div>

    <!-- Education & Internship Section -->
    <div class="container" transition:fade>
        <section class="education-content">
            <div class="row">
                <div class="education">
                    <h3 class="title">Education</h3>
                    <div class="row">
                        <div class="timeline-box">
                            <div class="timeline">
                                <!-- Timeline-item -->
                                <div class="timeline-item">
                                    <div class="circle-dot"></div>
                                    <h3 class="timeline-title">
                                        M.E Operations Research
                                    </h3>
                                    <h4 class="timeline-title">
                                        Ramanujan Computing Center
                                    </h4>
                                    <h4 class="timeline-title">
                                        Anna University
                                    </h4>
                                    <h4 class="timeline-title">
                                        <i class="fa fa-calendar"></i> 2023-2025
                                    </h4>
                                </div>

                                <!-- Timeline-item -->
                                <div class="timeline-item">
                                    <div class="circle-dot"></div>
                                    <h3 class="timeline-title">
                                        B.E Data Science - 91%
                                    </h3>
                                    <h4 class="timeline-title">
                                        Faculty of Engineering & Technology
                                    </h4>
                                    <h4 class="timeline-title">
                                        Annamalai University
                                    </h4>
                                    <h4 class="timeline-title">
                                        <i class="fa fa-calendar"></i> 2019-2023
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="internship">
                    <h3 class="title">Experience</h3>
                    <div class="row">
                        <div class="timeline-box">
                            <div class="timeline">
                                <div class="timeline-item">
                                    <div class="circle-dot"></div>
                                    <h3 class="timeline-title">
                                        Data Analyst Intern
                                    </h3>
                                    <h4 class="timeline-title">
                                        Galaxy Technology Services
                                    </h4>
                                    <h4 class="timeline-title">
                                        <i class="fa fa-calendar"></i> September
                                        2022 - May 2023 | Internship | Remote
                                    </h4>
                                    <li class="timeline-text">
                                        Data Analyst specializing in deploying
                                        machine learning models for diverse
                                        business challenges, leveraging Quantum
                                        computing for stock price predictions
                                        with an impressive 89% accuracy. Key
                                        contributor to a Proof-Of-Concept for
                                        stock prediction using Quantum computing
                                        at Galaxy Technology Services.
                                        Demonstrates expertise in advanced
                                        technologies, collaborative
                                        problem-solving, and strategic
                                        decision-making. Analytical with a keen
                                        eye for identifying patterns, committed
                                        to continuous learning and contributing
                                        to organizational success.
                                    </li>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
{/if}

<style lang="scss">
    .about-area {
        padding-top: 50px;
        background-color: #202020;
        @media only screen and (max-width: 767px) {
            padding-top: 15px;
        }

    }
    .about {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 50px;
        @media only screen and (max-width: 767px) {
            flex-direction: column;
            flex-basis: 100%;
            margin-bottom: 30px;
        }
    }
    .about-content {
        flex-basis: 60%;
    }
    .about-content h4 {
        color: #fed700;
        font-size: 40px;
        line-height: 70px;
        text-transform: capitalize;
        @media only screen and (max-width: 767px) {
            font-size: 25px;
            line-height: 0px;
            margin-bottom: 25px;
        }
    }
    .about-content ul {
        color: #fff;
        text-align: justify;
    }

    .about-content ul li {
        list-style-type: disc;
        margin-bottom: 10px;
    }

    .about-skills {
        flex-basis: 35%;
        @media only screen and (max-width: 767px) {
            width: 100%;
            margin-top: 30px;
        }
    }
    .about-skills ul li {
        border-bottom: 1px dashed #ddd;
        padding-bottom: 10px;
        margin-bottom: 10px;
        color: #fff;
        font-size: 18px;
    }
    .about-skills ul li:last-child {
        border-bottom: 0;
        padding-bottom: 0;
        margin-bottom: 0;
    }

    /*---------------------------Education & Internship---------------------------*/

    .education-content .row {
        display: flex;
        border-radius: 5px;
        height: 400px;
        margin-bottom: 250px;
        @media only screen and (max-width: 767px) {
            flex-direction: column;
            height: auto;
            margin-bottom: 50px;
        }
    }

    .education-content .title {
        color: #fed700;
    }
    .education-content .row .education,
    .education-content .row .internship {
        color: #e5e5e5;
        flex: 0 0 50%;
        max-width: 50%;
        margin-top: 30px;
        @media only screen and (max-width: 767px) {
            flex-basis: 100%;
            max-width: 100%;
            margin-top: 30px;
        }
    }
    .education-content h3.title {
        font-size: 24px;
        margin-bottom: 30px;
        font-weight: 700;
    }

    /* .education-content .row.timeline-box{
flex:0 0 100%;
max-width: 100%;  
} */

    .education-content .row .timeline {
        /* background-color:#e5e5e5; */
        padding: 30px 15px;
        border: 1px solid #e5e5e5;
        border-radius: 10px;
        width: 100%;
        position: relative;
    }
    .education-content .row .timeline-item {
        position: relative;
        padding-left: 37px;
        padding-bottom: 50px;
    }
    .education-content .row .internship .timeline-item {
        position: relative;
        padding-left: 37px;
        padding-bottom: 30px;
    }
    .education-content .row .timeline-item:last-child {
        padding-bottom: 0;
    }
    .education-content .row .timeline-item::before {
        content: "";
        width: 1px;
        position: absolute;
        height: 100%;
        left: 7px;
        top: 0;
        background-color: #fed700;
    }
    .education-content .row .circle-dot {
        position: absolute;
        left: 0;
        top: 0;
        height: 15px;
        width: 15px;
        border-radius: 50%;
        background-color: #e5e5e5;
    }
    .education-content .row .timeline-title {
        font-weight: 700;
        font-size: 18px;
        margin-bottom: 12px;
    }
    .education-content .row .internship .timeline-title {
        font-weight: 700;
        font-size: 18px;
        margin-bottom: 8px;
    }
    .education-content .row .timeline-text {
        line-height: 25px;
        font-size: 16px;
        text-align: justify;
    }
</style>
