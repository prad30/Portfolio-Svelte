<script>
    export let testimonial;
    let imageUrl = `http://localhost:5500/uploads/${testimonial.image}`; 

</script>

<div class="testimonial">
    <div class="testimonial-details">
        <img src={imageUrl} alt="" />
        <div>
            <h4 class="testimonial-name">{testimonial.name}</h4>
            <p>
                {testimonial.position} ,
                {testimonial.company}
            </p>
            <p>{testimonial.country}</p>
        </div>
    </div>
    <div class="testimonial-review">
        <br />
        <p>
            {testimonial.review}
        </p>
        <br />
        <i class="fa fa-star checked"></i>
        <i class="fa fa-star checked"></i>
        <i class="fa fa-star checked"></i>
        <i class="fa fa-star checked"></i>
        <i class="fa fa-star"></i>
    </div>
</div>


<style>
    .testimonial {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
        color: #e5e5e5;
        border: 2px solid #e5e5e5;
        border-radius: 10px;
        width: fit-content;
        position: relative;
        padding: 20px;
        flex-basis: 30%;
        transition: 0.3s;
        &:hover {
            border-color: #fed700;
        }
        @media (max-width: 1050px) {
            flex-basis: 48%; 
        }
        @media only screen and (max-width: 767px) {
            flex-basis: 100%;
            margin-bottom: 30px;
        }
    }

    .testimonial-details {
        display: flex;
        justify-content: space-evenly;
        gap: 5px;
        align-items: center;
        text-align: left;
    }

    .testimonial-details img {
        width: 125px;
        height: 125px;
        border-radius: 100%;
        border: #fed700 3px solid;
    }

    .testimonial-review {
        text-align: justify;
    }

    .testimonial-name {
        text-transform: capitalize;
        font-size: 18px;
    }

    .testimonial-details p {
        font-size: 12px;
        text-align: left;
    }

    .checked {
        color: #fed700;
    }
</style>
