// Define function to fetch data from API and create chart
async function createChart() {
    try {
      const response = await fetch('https://api.umd.io/v1/courses');
      const courses = await response.json();
  
      // Create object to store count of courses by major
      const majors = {};
  
      // Loop through courses and count by major
      courses.forEach(course => {
        if (majors[course.department]) {
          majors[course.department]++;
        } else {
          majors[course.department] = 1;
        }
      });
  
      // Get canvas element for chart
      const ctx = document.getElementById('myChart').getContext('2d');
  
      // Create chart using Charts.js
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(majors),
          datasets: [{
            label: 'Number of Courses',
            data: Object.values(majors),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
  
  // Call function to create chart
  createChart();