# WebGL Experiments

This directory contains a collection of WebGL experiments, each in its own subdirectory.

## Experiment Structure

Each experiment should follow a consistent structure:

-   **`kaaro.html`**: The main HTML file for the experiment.
-   **`kaaro.css`**: The CSS file for styling the experiment.
-   **`kaaro.js`**: The JavaScript file containing the experiment's logic.

## Setting Up a New Experiment

To create a new experiment, follow these steps:

1.  **Create a new directory** for your experiment within the `WebGL` directory. For example, `WebGL/MyNewExperiment`.
2.  **Copy the template files** from an existing experiment, such as `WebGL/triangle`, into your new directory.
3.  **Modify the `kaaro.html` file** to include any necessary scripts or libraries. Use the `importmap` to manage your dependencies.
4.  **Write your experiment's logic** in the `kaaro.js` file.
5.  **Add any necessary styles** to the `kaaro.css` file.
6.  **Create a Playwright test** for your experiment in the `tests` directory. This will help to ensure that your experiment is working correctly and to prevent regressions.
