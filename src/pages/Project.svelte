<script>
    import Projectcard from "../components/Projectcard.svelte";
    const projects = [
  {
    icon: "fa fa-handshake",
    title: "Recommendation System",
    link: "https://github.com/ragu8/RECOMMENDATION_SYSTEM",
    description: "Correlation | Pandas | Netflix Dataset",
    details: "The purpose of a recommender system is to suggest relevant items to users."
  },
  {
    icon: "fa fa-chart-bar",
    title: "Ozone Analysis",
    link: "https://github.com/ragu8/OZONE_ANALYSIS",
    description: "Visualization Techniques | Pandas & Matplotlib | NASA Dataset",
    details: "Visualize the fluctuation of ozone depletion area and significant global events from 1979 to 2022 using visualization techniques."
  },
  {
    icon: "fa fa-home",
    title: "House Price Prediction",
    link: "https://github.com/ragu8/HOUSE_PRICE_PREDICTION",
    description: "LinearRegression | Sklearn | House Prices Dataset",
    details: "To predict house prices using regression techniques, use a dataset containing relevant features and the corresponding house prices."
  },
  {
    icon: "fa fa-exchange",
    title: "GENERIC CLASSIFICATION",
    link: "https://github.com/ragu8/CLASSIFICATION",
    description: "Computer vision | Tensorflow | Image Datasets",
    details: "This Deep Learning model achieves a high accuracy of 90% or above using a Convolutional Neural Network (CNN) on any Image dataset."
  },
  {
    icon: "fa fa-clipboard",
    title: "IMAGE CLASSIFICATION USING QCNN",
    link: "https://github.com/ragu8/Quantum-Machine-Learning",
    description: "Quantum | Tensorflow-Quantum | MNIST Dataset",
    details: "Incorporating computation and QCNN in computer vision projects can potentially enhance results through advanced data processing and quantum machine learning."
  },
  {
    icon: "fa fa-expand",
    title: "HEART DISEASE PREDICTION",
    link: "https://github.com/ragu8/HEART_DISEASE_PREDICTION",
    description: "Statistical Analysis | EDA | ECG Dataset",
    details: "Machine Learning for Heart Disease Prediction: Repository for implementing machine learning algorithms to predict heart disease, contributing to early diagnosis and proactive healthcare management."
  },
  {
    icon: "fa fa-inr",
    title: "STOCK PRICE PREDICTION",
    link: "https://github.com/ragu8/com/blob/main/art.drawio.png",
    description: "Predictive Analytics | yfinance | Stock Data",
    details: "At Galaxy Technology Services, I built a Proof-Of-Concept using quantum computing to predict stock prices with an accuracy rate of 89%. This highlights the potential of quantum computing to significantly improve stock price prediction models."
  },
  {
    icon: "fa fa-forward",
    title: "VIDEO CLASSIFICATION",
    link: "https://github.com/ragu8/Video_classification",
    description: "Action Recognition | 3D CNN | Ucf101 Dataset",
    details: "Video Classification using UCF101: Repository containing code and models for classifying videos based on the UCF101 dataset, utilizing deep learning techniques for action recognition."
  },
  {
    icon: "fa fa-link",
    title: "PDF QUERYING",
    link: "https://github.com/ragu8/PDF_Extraction_and_DataMining_using_Langchain",
    description: "OpenAI API | Langchain | Pdf Mining",
    details: "PDF Extraction and Data Mining using Langchain: Repository for PDF querying, leveraging the OpenAI API and Langchain for efficient text extraction and data mining from PDF documents."
  }
];

</script>

<section class="project-content">
    <div class="container">
        <div class="project-title">
            <h4>My Projects</h4>
            <p>Discover my projects, where creativity meets innovation</p>
        </div>
        <div class="projects">
            {#each projects as project}
                <Projectcard {project} />
            {/each}
        </div>
    </div>
</section>

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
