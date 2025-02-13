<script>
    import Testimonialcard from "../components/Testimonialcard.svelte";
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";

    let testimonialData = [];

    onMount(async () => {
        try {
            const res = await fetch("http://localhost:5500/api/testimonials"); 
            if (res.ok) {
                testimonialData = await res.json();
            } else {
                console.error("Failed to fetch testimonials from backend.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    });

    let show = true;
</script>

{#if show}
    <div class="container" transition:fade>
        <section class="testimonial-content">
            <div class="add-testimony-btn">
                <a href="/writetestimony"> Write A Testimony</a>
            </div>
            <div class="testimonial-title">
                <h4>Testimonials</h4>
                <p>People said about Me</p>
            </div>
            <div class="testimonials">
                {#each testimonialData as testimonial}
                    <Testimonialcard {testimonial} />
                {/each}
            </div>
        </section>
    </div>
{/if}

<style lang="scss">
    .testimonial-content {
        position:relative;
        margin-top: 35px;
        padding: 50px 0;
        @media only screen and (max-width: 767px) {
            padding: 25px 0px;
        }
    }
    .testimonial-title {
        margin-bottom: 60px;
        text-align: center;
        @media only screen and (max-width: 767px) {
            margin-bottom: 30px;
        }
    }
    .testimonial-title h4 {
        text-transform: uppercase;
        font-size: 40px;
        line-height: 40px;
        color: #fed700;
        margin-bottom: 20px;
        @media only screen and (max-width: 767px) {
            font-size: 25px;
            line-height: 10px;
        }
    }
    .testimonial-title p {
        color: #e5e5e5;
    }
    .testimonials {
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
    }

.add-testimony-btn {
    position: absolute;
    top: -15px;
    right: 20px;
    z-index: 0;
}

.add-testimony-btn a {
    display: inline-block;
    background-color: #fed700;
    color: #202020;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    text-decoration: none;
    border-radius: 10px;
    transition: transform 0.2s, background-color 0.3s;
}

.add-testimony-btn a:hover {
    background-color: #f6ecb3;
    transform: scale(1.08);
}

@media only screen and (max-width: 767px) {
    .add-testimony-btn {
        top: -40px;
        right: 0px;
    }

    .add-testimony-btn a {
        font-size: 13px;
        padding: 5px 10px;
    }
}

</style>
