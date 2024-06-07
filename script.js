document.addEventListener('DOMContentLoaded', function () {
    fetch('./json/data.json')
        .then(response => response.json())
        .then(data => {
            const discountSalesData = data.discountSalesData;
            const discountProfitData = data.discountProfitData;
            const avgDiscountPerYearData = data.avgDiscountPerYearData;
            const profitMarginData = data.profitMarginData;
            const totalCustomerSegmentData = data.totalCustomerSegmentData;

            const ctxDiscountSales = document.getElementById('discountSalesChart').getContext('2d');
            const ctxDiscountProfitQuantity = document.getElementById('discountProfitQuantityChart').getContext('2d');
            const ctxAvgDiscountPerYear = document.getElementById('avgDiscountPerYearChart').getContext('2d');
            const ctxProfitMargin = document.getElementById('profitMarginChart').getContext('2d');
            const ctxTotalCustomerSegment = document.getElementById('totalCustomerSegmentChart').getContext('2d');

            let discountSalesChart;
            let discountProfitQuantityChart;
            let avgDiscountPerYearChart;
            let profitMarginChart;
            let totalCustomerSegmentChart;

            function createDiscountSalesChart(data) {
                const cities = data.map(item => item.City);
                const discounts = data.map(item => item.Discount);
                const sales = data.map(item => item.Sales);

                if (discountSalesChart) {
                    discountSalesChart.destroy();
                }

                discountSalesChart = new Chart(ctxDiscountSales, {
                    type: 'bar',
                    data: {
                        labels: cities,
                        datasets: [{
                            label: 'Discount',
                            data: discounts,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }, {
                            label: 'Sales',
                            data: sales,
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1
                        }]
                    }
                });
            }

            function createDiscountProfitQuantityChart(data) {
                const cities = data.map(item => item.City);
                const discounts = data.map(item => item.Discount);
                const profitQuantities = data.map(item => item['Profit/Quantity']);

                if (discountProfitQuantityChart) {
                    discountProfitQuantityChart.destroy();
                }

                discountProfitQuantityChart = new Chart(ctxDiscountProfitQuantity, {
                    type: 'bar',
                    data: {
                        labels: cities,
                        datasets: [{
                            label: 'Discount',
                            data: discounts,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }, {
                            label: 'Profit/Quantity',
                            data: profitQuantities,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    }
                });
            }

            function createAvgDiscountPerYearChart(data) {
                if (avgDiscountPerYearChart) {
                    avgDiscountPerYearChart.destroy();
                }
                avgDiscountPerYearChart = new Chart(ctxAvgDiscountPerYear, {
                    type: 'pie',
                    data: {
                        labels: data.map(item => item['Order Date (Tahun)']),
                        datasets: [{
                            label: 'Average Discount',
                            data: data.map(item => item.Discount),
                            borderWidth: 1
                        }]
                    }
                });
            }

            function createProfitMarginChart(data) {
                const categories = [...new Set(data.map(item => item.Category))];
                const years = [...new Set(data.map(item => item['Order Date (Tahun)']))];

                const datasets = years.map(year => {
                    return {
                        label: year,
                        data: categories.map(category => {
                            const item = data.find(d => d.Category === category && d['Order Date (Tahun)'] === year);
                            return item ? item['Kolom Baru'] : 0;
                        }),
                        borderWidth: 1
                    };
                });

                if (profitMarginChart) {
                    profitMarginChart.destroy();
                }

                profitMarginChart = new Chart(ctxProfitMargin, {
                    type: 'bar',
                    data: {
                        labels: categories,
                        datasets: datasets.map((dataset, index) => ({
                            ...dataset,
                        }))
                    }
                });
            }

            function createTotalCustomerSegmentChart(data) {
                const segments = ['Consumer', 'Corporate', 'Home Office'];
                const years = ['2014', '2015', '2016', '2017'];

                const aggregatedData = years.map(year => {
                    return segments.map(segment => {
                        const item = data.find(d => d.Tahun === year && d.Segment === segment);
                        return item ? item['Customer ID'] : 0;
                    });
                });

                const datasets = segments.map((segment, index) => {
                    return {
                        label: segment,
                        data: aggregatedData.map(data => data[index]),
                        borderWidth: 1
                    };
                });

                if (totalCustomerSegmentChart) {
                    totalCustomerSegmentChart.destroy();
                }

                totalCustomerSegmentChart = new Chart(ctxTotalCustomerSegment, {
                    type: 'bar',
                    data: {
                        labels: years,
                        datasets: datasets
                    }
                });
            }

            function getTopSixCities(data) {
                const sortedData = data.slice().sort((a, b) => b.Discount - a.Discount);
                return sortedData.slice(0, 6);
            }

            function populateFilters() {
                const cityFilter = document.getElementById('cityFilter');
                const profitCityFilter = document.getElementById('profitCityFilter');

                const allCities = [...new Set(discountSalesData.map(item => item.City))];
                const topSixCities = getTopSixCities(discountSalesData);

                allCities.forEach(city => {
                    const option = document.createElement('option');
                    option.value = city;
                    option.textContent = city;
                    cityFilter.appendChild(option);
                });

                const profitCities = [...new Set(discountProfitData.map(item => item.City))];
                profitCities.forEach(city => {
                    const option = document.createElement('option');
                    option.value = city;
                    option.textContent = city;
                    profitCityFilter.appendChild(option);
                });

                const initialDiscountSalesData = topSixCities;
                createDiscountSalesChart(initialDiscountSalesData);
                const initialDiscountProfitData = getTopSixCities(discountProfitData);
                createDiscountProfitQuantityChart(initialDiscountProfitData);
            }

            populateFilters();
            createAvgDiscountPerYearChart(avgDiscountPerYearData);
            createProfitMarginChart(profitMarginData);
            createTotalCustomerSegmentChart(totalCustomerSegmentData);

            document.getElementById('cityFilter').addEventListener('change', function () {
                const selectedCity = this.value;
                const filteredData = selectedCity === 'all' ? getTopSixCities(discountSalesData) : discountSalesData.filter(item => item.City === selectedCity);
                createDiscountSalesChart(filteredData);
            });

            document.getElementById('profitCityFilter').addEventListener('change', function () {
                const selectedCity = this.value;
                const filteredData = selectedCity === 'all' ? getTopSixCities(discountProfitData) : discountProfitData.filter(item => item.City === selectedCity);
                createDiscountProfitQuantityChart(filteredData);
            });
        });
});
