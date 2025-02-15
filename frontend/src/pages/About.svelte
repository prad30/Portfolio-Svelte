
<svelte:head>
    <title>About</title>
    <meta name="description" content="Data enthusiast with expertise in analytics, machine learning, and operations research. Experienced in predictive modeling and optimization techniques." />
    <meta name="keywords" content="Ragupathy, Ragu, Data Science, Machine Learning, Analytics, Operations Research, Predictive Modeling, Optimization" />
    <meta property="og:url" content="https://ragu8.in/about" />
</svelte:head>

    <div class="container">
        <section class="about-area">
            <div class="about">
                <div class="about-content">
                    <h4>About Me</h4>
                    <ul>
                        <li>
                            Data enthusiast with a proven track record in
                            leveraging analytics and machine learning techniques
                            to drive business insights and decision-making.
                        </li>
                        <li>
                            Proficient in developing innovative solutions to
                            complex problems through data analysis and
                            predictive modeling.
                        </li>
                        <li>
                            Strong background in Operations Research, applying
                            optimization techniques to enhance operational
                            efficiency and strategic decision-making processes.
                        </li>
                    </ul>
                </div>

                <div class="about-skills">
                    <ul>
                        <li>
                            <img src="/assets/profile.png" alt="" />
                            Ragupathi M
                        </li>
                        <li>
                            <img src="/assets/mail.png" alt="" /> <a href="mailto:https.ragu@gmail.com">https.ragu@gmail.com</a>
                        </li>
                        <li>
                            <i class="fab fa-github"></i>
                            <!-- Github: -->
                            <a href="https://github.com/ragu8"
                                >https://github.com/ragu8</a
                            >
                        </li>
                        <li>
                            <img src="/assets/kaggle.png" alt="" />
                            <a href="https://www.kaggle.com/ragu08"
                                >https://www.kaggle.com/ragu08</a
                            >
                        </li>
                        <li>
                            <img src="/assets/linked-in.png" alt="" />
                            <!-- LinkedIn: -->
                            <a href="https://www.linkedin.com/in/ragu8/"
                                >https://www.linkedin.com/ragu8</a
                            >
                        </li>
                        <li>
                            <img src="/assets/sand-clock.png" alt="" /> Experience:
                            2 yr
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- Education Section -->
        <section class="education-content">
            <h3 class="title">Education</h3>
            <div class="row">
                <div class="timeline-box">
                    <!-- Timeline-item -->
                    <div class="timeline-item">
                        <div class="circle-dot"></div>
                        <h3 class="timeline-title">M.E Operations Research</h3>
                        <h4 class="timeline-title">Grade: A+</h4>
                        <h4 class="timeline-title">
                            Ramanujan Computing Center
                        </h4>
                        <h4 class="timeline-title">
                            College of Engineering Guindy
                        </h4>
                        <h4 class="timeline-title">Anna University</h4>
                        <h4 class="timeline-title">
                            <i class="fa fa-calendar"></i> 2023-2025
                        </h4>
                    </div>

                    <!-- Timeline-item -->
                    <div class="timeline-item">
                        <div class="circle-dot"></div>
                        <h3 class="timeline-title">B.E Data Science</h3>
                        <h4 class="timeline-title">Grade: A+</h4>
                        <h4 class="timeline-title">
                            Faculty of Engineering & Technology
                        </h4>
                        <h4 class="timeline-title">Annamalai University</h4>
                        <h4 class="timeline-title">
                            <i class="fa fa-calendar"></i> 2019-2023
                        </h4>
                    </div>
                </div>
            </div>
        </section>
    </div>
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
        justify-content: space-evenly;
        align-items: center;
        margin-bottom: 50px;
        gap: 15px;
        @media only screen and (max-width: 767px) {
            flex-direction: column;
            flex-basis: 100%;
            margin: 0px 5px 30px 15px;
        }
    }
    .about-content {
        flex-basis: 50%;
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
        @media only screen and (max-width: 1050px) {
            flex-basis: 40%;
        }
        @media only screen and (max-width: 767px) {
            width: 100%;
            margin-top: 30px;
        }
    }

    .about-skills i {
        color: #fed700;
        width: 25px;
        padding-left: 3px;
        transition: 0.5s;
        &:hover {
            transform: rotate(360deg);
        }
    }

    .about-skills img {
        width: 25px;
        transition: 0.5s;
        &:hover {
            transform: rotate(360deg);
        }
    }

    .about-skills li {
        border-bottom: 1px dashed #ddd;
        padding-bottom: 10px;
        margin-bottom: 10px;
        color: #fff;
        font-size: 16px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .about-skills li:last-child {
        border-bottom: 0;
        padding-bottom: 0;
        margin-bottom: 0;
    }

    /*---------------------------Education & Internship---------------------------*/


    .education-content{
        margin: 100px 0px;
        @media only screen and (max-width: 767px) {
            margin: 50px 0px;
        }
    }
    .timeline-box {
        flex: 0 0 100%;
        max-width: 950px;
        padding: 30px 20px;
        // border: 1px solid #e5e5e5;
        border-radius: 10px;
        position: relative;
        display: flex;
        justify-content: space-evenly;
        // align-items: center;
        gap: 20px;
        @media only screen and (max-width: 767px) {
            flex-direction: column;
            margin: 0px 10px;
        }
        }

    .timeline-item {
        position: relative;
        padding: 25px 5px 10px 50px;
        border: 1px solid #e5e5e5;
        border-radius: 10px;
        flex: 50%;
        color: #ddd;
    }
    
    .circle-dot {
        position: absolute;
        left: 20px;
        top: 34px;
        height: 15px;
        width: 15px;
        border: 5px solid black;
        border-radius: 50%;
        background-color: #fed700;
    }
    .timeline-title {
        font-weight: 600;
        font-size: 18px;
        margin-bottom: 10px;
    }

    .education-content .title {
        text-align: center;
        color: #fed700;
        font-size: 40px;
        margin-bottom: 40px;
    }

    .timeline-item {
        position: relative;
    }

    .row{
        display: flex;
        justify-content: center;
        @media only screen and (max-width: 767px) {
            // flex-direction: column;
            margin: 0px 5px;
        }
    }
</style>
