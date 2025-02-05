<script>
    import { onMount } from "svelte";
    import { link } from "svelte-spa-router";
    import { slide,fade } from "svelte/transition";

    let activePage = "/home";
    let menuOpen = false;

    onMount(() => {
        if (window.location.pathname !== "#/home") {
            window.location.replace("#/home");
        }
    });

    function setActivePage(page) {
        activePage = page;
        menuOpen = false;
    }

    // function toggleMenu() {
    //     menuOpen = !menuOpen;
    // }

</script>

<header class="header-area">
    <div class="container">
        <div class="header">
            <a href="/home" use:link class="logo">
                <img
                    src="/assets/signaturecropped.png"
                    alt="logo"
                    class="signature"
                />
                <i class="fa fa-bolt"></i>
            </a>
            {#if menuOpen}
            <ul class="navbar" class:open={menuOpen} transition:fade>
                <li>
                    <a
                        href="/home"
                        use:link
                        class={activePage === "/home" ? "active" : ""}
                        on:click={() => setActivePage("/home")}>Home</a
                    >
                </li>
                <li>
                    <a
                        href="/about"
                        use:link
                        class={activePage === "/about" ? "active" : ""}
                        on:click={() => setActivePage("/about")}>About</a
                    >
                </li>
                <li>
                    <a
                        href="/projects"
                        use:link
                        class={activePage === "/projects" ? "active" : ""}
                        on:click={() => setActivePage("/projects")}>Projects</a
                    >
                </li>
                <li>
                    <a
                        href="/contact"
                        use:link
                        class={activePage === "/contact" ? "active" : ""}
                        on:click={() => setActivePage("/contact")}>Contact</a
                    >
                </li>
            </ul>
            {/if}
            <ul class="navbar" class:open={menuOpen} transition:slide>
                <li>
                    <a
                        href="/home"
                        use:link
                        class={activePage === "/home" ? "active" : ""}
                        on:click={() => setActivePage("/home")}>Home</a
                    >
                </li>
                <li>
                    <a
                        href="/about"
                        use:link
                        class={activePage === "/about" ? "active" : ""}
                        on:click={() => setActivePage("/about")}>About</a
                    >
                </li>
                <li>
                    <a
                        href="/projects"
                        use:link
                        class={activePage === "/projects" ? "active" : ""}
                        on:click={() => setActivePage("/projects")}>Projects</a
                    >
                </li>
                <li>
                    <a
                        href="/contact"
                        use:link
                        class={activePage === "/contact" ? "active" : ""}
                        on:click={() => setActivePage("/contact")}>Contact</a
                    >
                </li>
            </ul>
            <button class="menu_icon" on:click={()=>menuOpen = !menuOpen} aria-label="Toggle menu">
                <i class="fa fa-bars"></i>
            </button>
        </div>
    </div>
</header>

<style>
    .header-area {
        padding: 15px 0;
        position: sticky;
        top: 0%;
        width: 100%;
        z-index: 100;
        background-color: #202020;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .logo {
        display: flex;
        align-items: center;
        position: relative;
        text-transform: uppercase;
        font-size: 26px;
        font-weight: 700;
    }

    .logo .fa-bolt {
        color: #fed700;
        font-size: 19.5px;
        position: absolute;
        top: 60%;
        left: 100%;
        transform: translate(-50%, -50%);
        z-index: 1;
    }

    .signature {
        width: 100px;
        height: auto;
        margin-right: 10px;
    }

    .header ul {
        display: flex;
        align-items: center;
        @media only screen and (max-width: 767px) {
            display: none;
        }
    }

    .header ul li {
        margin: 0 15px;
    }

    .header ul li a {
        text-transform: capitalize;
        display: block;
        &:hover {
            color: #fed700;
        }
    }
    .header ul li a.active {
        color: #fed700;
    }
    .header .menu_icon {
        color: #fff;
        font-size: 18px;
        cursor: pointer;
        display: none;
        border: none;
        background-color:#202020;
    }

    @media only screen and (max-width: 767px) {
        .header .menu_icon {
            display: block;
        }

        .header i {
            color: #e5e5e5;
        }
        
        .navbar {
            display: none;
            flex-direction: column;
            position: absolute;
            top: 70px;
            right: 0;
            background-color: #202020;
            width: 100%;
            padding: 10px;
            border-radius: 5px;
        }
        .navbar.open {
            display: flex;
        }
    }
</style>
