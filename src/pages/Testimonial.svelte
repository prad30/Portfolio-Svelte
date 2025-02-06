<script>
    import Testimonialcard from "../components/Testimonialcard.svelte";
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";

    let testimonialData = [];

    onMount(async () => {
        const res = await fetch("/data/Testimonial.json");
        if (res.ok) {
            testimonialData = await res.json();
        } else {
            console.error("Failed to fetch data.");
        }
    });
    let show = true;
</script>

{#if show}
    <div class="container" transition:fade>
        <section class="testimonial-content">
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

<style>
    .testimonial-content {
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
</style>
