// Define function to fetch data from API and create chart
async function createChart() {
    try {
     // need to figure out how to paginate the API using page=number by figuring out the endpoint somehow -- is is ?page_number=1 and goes up until 157
      const response = await fetch('https://api.umd.io/v1/courses');
      const courses = await response.json();
  
      // Create object to store count of courses by major --> will work once collecting all majors
      const majors = courses.reduce((obj, course) => {
        obj[course.department] = obj[course.department] + 1 || 1;
        return obj;
      }, {});
  
      // pulls the myChart element from HTML for charts.js
      const ctx = document.getElementById('myChart').getContext('2d');
  
      // Charts.js chart
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
  