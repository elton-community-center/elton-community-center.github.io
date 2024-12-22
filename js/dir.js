document.addEventListener("DOMContentLoaded", function () {
    const DirList = document.getElementById("list");
    const HRule = document.getElementById("h-rule");
    const Back = document.getElementById("back");

    HRule.style.display = "none";
    Back.style.display = "none";
    Back.classList.add('folder-link');

    // Variable to track the current folder and its parent
    let currentFolder = null;
    let currentParent = null;

    // Fetch the JSON data
    fetch('./json/dir.json')
        .then(response => response.json())
        .then(data => {
            // Function to create the folder links
            function createLinks(folder) {
                // Clear the current list
                DirList.innerHTML = '';

                // If we are not at the root folder, show a back button
                if (currentParent) {
                    HRule.style.display = "block";
                    Back.style.display = "block";

                    // Set the Back button click listener
                    Back.onclick = function () {
                        // Navigate back to the parent folder
                        currentFolder = currentParent;
                        currentParent = currentParent.parent || null; // Update parent
                        createLinks(currentFolder);
                    };
                } else {
                    HRule.style.display = "none";
                    Back.style.display = "none";
                }

                // Create links for the folder's children
                folder.children.forEach(child => {
                    const linkContainer = document.createElement('li');
                    const link = document.createElement('a');
                    link.classList.add('folder-link');
                    link.textContent = "• " + child.name;
                    if (child.path == "") {
                        link.setAttribute("href", "#"); // Placeholder href
                    } else {
                        link.setAttribute("href", child.path);
                    }
                    linkContainer.appendChild(link);
                    DirList.appendChild(linkContainer);

                    // Add click event listener to load subfolders if they exist
                    link.addEventListener('click', function () {
                        if (child.children && child.children.length > 0) {
                            // Set the parent reference for the clicked folder
                            child.parent = folder; // Dynamically set parent
                            currentParent = folder; // Update current parent
                            currentFolder = child; // Update current folder
                            createLinks(child); // Pass the clicked folder to createLinks
                        }
                    });
                });
            }

            // Initialize with the root folder
            currentFolder = data;
            createLinks(data);
        })
        .catch(error => {
            console.error('Error loading or parsing JSON:', error);
        });
});
