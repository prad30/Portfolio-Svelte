<script>
    import { Router, Route } from "svelte-routing";
    import { onMount } from "svelte";
    import Navbar from "./components/Navbar.svelte";
    import Home from "./pages/Home.svelte";
    import About from "./pages/About.svelte";
    import Projects from "./pages/Project.svelte";
    import Contact from "./pages/Contact.svelte";
    import Footer from "./components/Footer.svelte";
    import Testimonial from "./pages/Testimonial.svelte";
    import WriteTestimony from "./pages/WriteTestimony.svelte";
    
    let loading = false;

    function startLoading() {
        loading = true;
    }

    function stopLoading() {
        setTimeout(() => {
            loading = false;
        }, 1000);
    }

    onMount(() => {
        window.addEventListener("beforeunload", startLoading);
        window.addEventListener("load", stopLoading);
    });
</script>

<Router on:navigating={startLoading} on:navigated={stopLoading}>
    <Navbar />

    {#if loading}
        <div class="loading">
            <div class="spinner"></div>
        </div>
    {/if}

    <Route path="/" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/projects" component={Projects} />
    <Route path="/testimonials" component={Testimonial} />
    <Route path="/writetestimony" component={WriteTestimony} />
    <Route path="/contact" component={Contact} />

    <Footer />
</Router>

<style lang="scss">
    :global(.container) {
        width: 1170px;
        margin: auto;
        @media only screen and (min-width: 1000px) and (max-width: 1200px) {
            width: 970px;
        }
        @media only screen and (min-width: 768px) and (max-width: 999px) {
            width: 750px;
        }
        @media only screen and (max-width: 767px) {
            width: 350px;
            padding: 15px;
        }
    }

    .loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 1.5rem;
        z-index: 1000;
    }

    .spinner {
        border: 5px solid #fff;
        border-top: 5px solid #fed700;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    
</style>
