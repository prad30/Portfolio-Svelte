<script>
    export let project;
</script>

<div class="project">
    <i class={project.icon}></i>
    <h4><a href={project.link} target="_blank">{project.title}</a></h4>
    <p>{project.description}</p>
    <br />
    <li>{project.details}</li>
</div>

<style lang="scss">
    .project {
        margin-bottom: 20px;
        color: #e5e5e5;
        border: 2px solid #e5e5e5;
        border-radius: 10px;
        width: 100%;
        position: relative;
        padding: 25px;
        text-align: center;
        flex-basis: 32%;
        transition: 0.3s;
        &:hover {
            border-color: #fed700;
        }
        @media only screen and (max-width: 767px) {
            flex-basis: 100%;
            margin-bottom: 30px;
        }
    }
    .project i {
        background-color: #fed700;
        width: 60px;
        height: 60px;
        color: #333;
        font-size: 26px;
        line-height: 60px;
        border-radius: 50%;
    }
    .project h4 {
        font-size: 26px;
        text-transform: capitalize;
        margin: 20px 0;
    }
    .project p {
        text-align: justify;
    }
</style>
