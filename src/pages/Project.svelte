<script>
  import Projectcard from "../components/Projectcard.svelte";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  let Projectdata = [];

  onMount(async () => {
    const res = await fetch("/data/project.json"); // Access file from the public folder
    if (res.ok) {
      Projectdata = await res.json();
    } else {
      console.error("Failed to fetch data.");
    }
  });
  let show = true;
</script>

{#if show}
  <div class="container" transition:fade>
    <section class="project-content">
      <div class="project-title">
        <h4>My Projects</h4>
        <p>Discover my projects, where creativity meets innovation</p>
      </div>
      <div class="description">
        <p>
          I specialize in AI, Data Science, and Quantum Computing, delivering
          cutting-edge solutions for intelligent automation, predictive
          analytics, and quantum-powered optimizations across industries.
        </p>
      </div>
      <div class="projects">
        {#each Projectdata as project}
          <Projectcard {project} />
        {/each}
      </div>
    </section>
  </div>
{/if}

<style lang="scss">
  .project-content {
    padding: 50px 0;
    @media only screen and (max-width: 767px) {
      padding: 25px 0px;
    }
  }
  .project-title {
    margin-bottom: 30px;
    text-align: center;
    @media only screen and (max-width: 767px) {
      margin-bottom: 30px;
    }
  }

  // .description{
  //   margin-bottom: 40px;
  //   border: 2px solid #e5e5e5;
  //   padding: 20px;
  //   text-align: justify;
  //   hyphens: auto;
  //   color: #e5e5e5;
  //   border-radius: 10px;
  //   p{
  //     font-size: 18px;
  //   }
  // }

  .description {
  // margin-bottom: 40px;
  padding: 25px;
  text-align: center;
  max-width: 950px;
  margin: 0px auto 40px;
  hyphens: none;
  // background-color:rgba(255, 255, 255, 0.2) ;
  color: #e5e5e5;
  border-radius: 10px;
  // border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0px 10px rgba(254, 215, 0, 0.4);
  font-size: 18px;
  font-weight: 500;
  transition: all 0.3s ease-in-out;
}

.description:hover {
  transform: translateY(-4px);
  // box-shadow: 0 6px 35px rgba(254, 215, 0, 0.5);
}

.description p {
  text-align: center;
  line-height: 1.6;
  position: relative;
  display: inline-block;
  max-width: 90%;
}

.description p::before {
  content: "“";
  font-size: 28px;
  font-weight: bold;
  color: #fed700;
  position: absolute;
  left: -15px;
  top: -10px;
  @media only screen and (max-width: 767px) {
      left: -20px;
    }

  // opacity: 0.8;
}

.description p::after {
  content: "”";
  font-size: 28px;
  font-weight: bold;
  color: #fed700;
  position: absolute;
  right: -15px;
  bottom: -10px;
  @media only screen and (max-width: 767px) {
      right: -20px;
    }
  // opacity: 0.8;
}







  .project-title h4 {
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
  .project-title p {
    color: #e5e5e5;
  }
  .projects {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
</style>
