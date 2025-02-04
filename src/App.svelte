<script>
	import Router from "svelte-spa-router";
	import Navbar from "./components/Navbar.svelte";
	import Home from "./pages/Home.svelte";
	import About from "./pages/About.svelte";
	import Project from "./pages/Project.svelte";
	import Contact from "./pages/Contact.svelte";
	import Footer from "./components/Footer.svelte";

	const routes = {
		"/home": Home,
		"/about": About,
		"/projects": Project,
		"/contact": Contact,
	};
</script>

<Navbar />

<Router {routes} />

<Footer />

<style lang="scss">
	:global(.container) {
		width: 1170px;
		margin: auto;
		@media only screen and (min-width: 1000px) and (max-width: 1200px) {
			width: 970px;
		}
		@media only screen and (min-width:768px) and (max-width:999px){
			width: 750px;
		}
		@media only screen and (max-width:767px){
			width: 350px;
			padding:0;
		}
	}
</style>
