<script>
    import { Router, Route } from "svelte-routing";
    import Navbar from "./components/Navbar.svelte";
    import Home from "./pages/Home.svelte";
    import About from "./pages/About.svelte";
    import Projects from "./pages/Project.svelte";
    import Contact from "./pages/Contact.svelte";
    import Footer from "./components/Footer.svelte";
    import Testimonial from "./pages/Testimonial.svelte";
</script>

<Router>
    <Navbar />

    <Route path="/" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/projects" component={Projects} />
    <Route path="/testimonials" component={Testimonial} />
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
</style>
