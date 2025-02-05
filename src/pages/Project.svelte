<script>
    import Projectcard from "../components/Projectcard.svelte";
    import { fade } from "svelte/transition";
    import { onMount } from 'svelte';
  
    let Projectdata = [];
  
    onMount(async () => {
      const res = await fetch('/data/project.json'); // Access file from the public folder
      if (res.ok) {
        Projectdata = await res.json();
      } else {
        console.error("Failed to fetch data.");
      }
    });
    let show = true;
  </script>
  
  {#if show}
    <section class="project-content" transition:fade>
      <div class="container">
        <div class="project-title">
          <h4>My Projects</h4>
          <p>Discover my projects, where creativity meets innovation</p>
        </div>
        <div class="projects">
          {#each Projectdata as project}
            <Projectcard {project} />
          {/each}
        </div>
      </div>
    </section>
  {/if}
  
  <style>
    .project-content {
      padding: 50px 0;
    }
    .project-title {
      margin-bottom: 60px;
      text-align: center;
    }
    .project-title h4 {
      text-transform: uppercase;
      font-size: 40px;
      line-height: 40px;
      color: #fed700;
      margin-bottom: 20px;
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
  