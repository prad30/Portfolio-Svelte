<script>
    let name = "";
    let position = "";
    let company = "";
    let country = "";
    let review = "";
    let image = null;
    let isSubmitting = false; 
    let imagePreview = "";

    function handleImageChange(event) {
        image = event.target.files[0];
        if (image) {
            imagePreview = URL.createObjectURL(image);
        }
    }

    async function submitForm(event) {
        event.preventDefault();

        if (isSubmitting) return;

        const formData = new FormData();
        formData.append("name", name);
        formData.append("position", position);
        formData.append("company", company);
        formData.append("country", country);
        formData.append("review", review);
        formData.append("image", image);

        isSubmitting = true; 

        try {
            const response = await fetch("http://localhost:5500/api/testimonials/add", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("Testimonial submitted successfully!");
                
                name = position = company = country = review = "";
                image = null;
                imagePreview = "";
            } else {
                const error = await response.json();
                alert(` Failed to submit: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Server error.");
        } finally {
            isSubmitting = false; 
        }
    }
</script>

<div class="container">
    <div class="testimony-form">
        <div class="title">
            <h1>Write A Testimony</h1>
            <p>Tell Something ...</p>
        </div>
        <form on:submit={submitForm}>
            <label class="file-upload">
                Upload Image
                <input type="file" name="image" required on:change={handleImageChange} />
            </label>

            {#if imagePreview}
                <div class="image-preview">
                    <img src={imagePreview} alt="" />
                </div>
            {/if}

            <input type="text" placeholder="Your Name" bind:value={name} required />
            <input type="text" placeholder="Position" bind:value={position} required />
            <input type="text" placeholder="Company Name" bind:value={company} required />
            <input type="text" placeholder="Country" bind:value={country} required />
            <textarea placeholder="Review About Me" rows="5" bind:value={review} required></textarea>

            <div class="btn-container">
                <button type="submit" class="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </form>
    </div>
</div>

<style lang="scss">
    .title {
        text-align: center;
        margin-bottom: 50px;
    }

    .title h1 {
        font-size: 40px;
        color: #fed700;
        padding-bottom: 15px;
    }

    .title p {
        color: #fff;
    }

    .file-upload {
        position: relative;
        display: inline-block;
        overflow: hidden;
        border-radius: 8px;
        padding: 10px 20px;
        border: 2px solid #fed700;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        transition: 0.3s;
    }

    .file-upload:hover {
        background-color: #fed700;
        color: black;
    }

    .file-upload input[type="file"] {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .image-preview {
        margin: 10px 0;
        text-align: center;
    }

    .image-preview img {
        max-width: 100px;
        max-height: 100px;
        border-radius: 5px;
    }

    .testimony-form {
        padding: 40px 0;
        max-width: 800px;
        margin: auto;
    }

    input,
    textarea {
        font-size: 15px;
        color: #202020;
        width: 100%;
        padding: 15px;
        margin-bottom: 20px;
        border-radius: 10px;
        background-color: #f6ecb3;
        border: 3px solid #f6ecb3;
    }

    input:hover,
    textarea:hover {
        border-color: rgb(252, 226, 76);
    }

    .btn-container {
        text-align: center;
    }

    .submit {
        background-color: #fed700;
        padding: 10px 40px;
        font-weight: bold;
        font-size: 18px;
        border: none;
        border-radius: 30px;
        transition: 0.2s;
    }

    .submit:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }

    .submit:hover {
        transform: scale(1.1);
        cursor: pointer;
    }
</style>
