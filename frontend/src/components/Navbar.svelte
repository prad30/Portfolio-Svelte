<script>
    import { slide } from 'svelte/transition';

    let menuOpen = false;
    let activePage =window.location.pathname;

</script>

<header class="header-area">
    <div class="container">
        <div class="header">
            <a href="/" class="logo">
                <img src="/assets/signaturecropped.png" alt="logo" class="signature" />
                <i class="fa fa-bolt"></i>
            </a>

            {#if menuOpen}
            <ul class="navbar {menuOpen ? 'open' : ''}" transition:slide>
                <li>
                    <a href="/" class={activePage === "/" ? "active" : ""} >Home</a>
                </li>
                <li>
                    <a href="/about" class={activePage === "/about" ? "active" : ""} >About</a>
                </li>
                <li>
                    <a href="/experience" class={activePage === "/experience" ? "active" : ""} >Experience</a>
                </li>
                <li>
                    <a href="/projects" class={activePage === "/projects" ? "active" : ""} >Projects</a>
                </li>
                <li>
                    <a href="/testimonials" class={activePage === "/testimonials" ? "active" : ""} >Testimonials</a>
                </li>
                <li>
                    <a href="/contact" class={activePage === "/contact" ? "active" : ""} >Contact</a>
                </li>
            </ul>
            {/if}

            <ul class="navbar {menuOpen ? 'open' : ''}">
                <li>
                    <a href="/" class={activePage === "/" ? "active" : ""}>Home</a>
                </li>
                <li>
                    <a href="/about" class={activePage === "/about" ? "active" : ""}>About</a>
                </li>
                <li>
                    <a href="/experience" class={activePage === "/experience" ? "active" : ""} >Experience</a>
                </li>
                <li>
                    <a href="/projects" class={activePage === "/projects" ? "active" : ""}>Projects</a>
                </li>
                <li>
                    <a href="/testimonials" class={activePage === "/testimonials" ? "active" : ""} >Testimonials</a>
                </li>
                <li>
                    <a href="/contact" class={activePage === "/contact" ? "active" : ""}>Contact</a>
                </li>
            </ul>

            <button class="menu-icon" on:click={() => (menuOpen = !menuOpen)} aria-label="Toggle menu">
                <i class="fa {menuOpen ? 'fa-times' : 'fa-bars'}"></i>
            </button>
        </div>
    </div>
</header>

<style>
    .header-area {
        padding: 15px 0;
        position: sticky;
        top: 0;
        width: 100%;
        z-index: 100;
        background-color: #202020;
        @media only screen and (max-width: 767px) {
            padding: 0px;
        }
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 10px;
    }

    .logo {
        display: flex;
        align-items: center;
        position: relative;
    }

    .logo .fa-bolt {
        color: #fed700;
        font-size: 19.5px;
        position: absolute;
        top: 60%;
        left: 100%;
        transform: translate(-50%, -50%);
        z-index: 1;
        @media only screen and (max-width: 767px) {
            font-size: 13px;
        }
    }

    .signature {
        width: 100px;
        height: auto;
        margin-right: 10px;
        @media only screen and (max-width: 767px) {
            width: 85px;
            margin-right: 5px;
        }

    }

    .navbar {
        display: flex;
        align-items: center;
    }

    .navbar li {
        margin: 0 15px;
    }

    .navbar li a {
        text-transform: capitalize;
        display: block;
        color: white;
    }

    .active {
        color: #fed700 !important;
    }


    .menu-icon {
        display: none;
        width: 40px;
        height: 40px;
        /* background: #fed700; */
        /* color:#202020; */
        background:#202020; 
        color: #fed700;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        box-shadow: 0px 0px 2px rgba(254, 215, 0,1);
        transition: all 0.3s ease-in-out;
    }

    .menu-icon i {
        font-size: 22px;
        transition: transform 0.3s ease-in-out;
    }

    .fa-bars {
        transform: rotate(0deg);
    }

    .fa-times {
        transform: rotate(180deg);
        /* color: #ff4d4d; */
    }

    @media only screen and (max-width: 767px) {
        .menu-icon {
            display: block;
        }

        .navbar {
            display: none;
            flex-direction: column;
            position: absolute;
            top: 60px;
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
