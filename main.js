const app = new Vue({
    el:'#vue',
    data:{
        weather : [],
        temps: [],
        winds:[],
        humids:[],
        chartTitle : '',
        cityName :'',
        loading: true,
        x : [],
    },
    methods:{
        readData:async function(){
            this.loading = true;
            const targetURL ='https://api.openweathermap.org/data/2.5/forecast?q='+ this.cityName +'&appid=c3c9c50c2595727a1c1e9bba67f73e0b';
            this.weather = await fetch(targetURL,{
                methods: "GET",
            })
            .then(res => res.json())
            .then(data => data)
            .catch(err => err)
            this.temps = this.avgTemp;
            this.winds = this.avgSpeed;
            this.humids = this.avgHumid;
            this.loading = false;
            setTimeout( () => {this.fillChartWithTemp();},10)
        },
        init: function() {
            this.readData();
        },
        timeConverter:function(dt){
            let d = new Date(dt * 1000);
                hh = d.getHours(),
                h = hh,
                ampm = 'AM';
                if (hh > 12) {
                    h = hh - 12;
                    ampm = 'PM';
                } else if (hh === 12) {
                    h = 12;
                    ampm = 'PM';
                } else if (hh == 0) {
                    h = 12;
                }
                return  h + ' ' + ampm;
        },
        timeConverterWithMin:function(dt){
            var d = new Date(dt * 1000), 
            yyyy = d.getFullYear(),
            mm = ('0' + (d.getMonth() + 1)).slice(-2),  
            dd = ('0' + d.getDate()).slice(-2),        
            hh = d.getHours(),
            h = hh,
            min = ('0' + d.getMinutes()).slice(-2),    
            ampm = 'AM';
        if (hh > 12) {
            h = hh - 12;
            ampm = 'PM';
        } else if (hh === 12) {
            h = 12;
            ampm = 'PM';
        } else if (hh == 0) {
            h = 12;
        }
    
        // ie: 2014-03-24, 3:00 PM
        time = h + ':' + min + ' ' + ampm;
        return time;
        },

        temperatureConverter:function(temp){
            return Math.round(temp-273.15);
        },
        fillChart() {
            Chart.defaults.global.defaultFontColor = 'darkblue';
            var ctx = this.$refs['myChart'].getContext('2d');
            var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.chartWeek,
                datasets: [{
                    label: this.chartTitle,
                    data: this.x,
                    backgroundColor: [
                        'rgba(0, 42, 100)',
                        'rgba(0, 64, 125)', 
                        'rgba(0, 87, 152)', 
                        'rgba(0, 111, 179)', 
                        'rgba(0, 145, 206)',  
                    ],
                   
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
        },
        fillChartWithTemp:function(){
             this.x = this.temps;
             this.chartTitle = "Temperature C";
             this.fillChart();
             
        },
        fillChartWithWind:function(){
            this.x = this.winds;
            this.chartTitle = "Wind km/h";
             this.fillChart();
             
        },
        fillChartWithHumidity:function(){
            this.x = this.humids;
            this.chartTitle = "Humidity %"
             this.fillChart();
            
        }
    },
    computed:{
        
        dayTime:function(){
            let arr =[];
            let time;
            for (let i = 0; i < 8; i++) {
                time = this.timeConverter(this.weather.list[i].dt);
                arr.push(time);
            }
            return arr;   
        },
        showIcon:function(){
            let icon = this.weather.list[0].weather[0].icon;
            return "http://openweathermap.org/img/wn/"+icon+"@2x.png";
        },
        dayIcon:function(){
            let arr = [];
            for (let i = 0; i < 8; i++) {
                arr.push("http://openweathermap.org/img/wn/"+this.weather.list[i].weather[0].icon+"@2x.png");
            }
            return arr;
        },
        temp:function(){
            return Math.round(this.temperatureConverter(this.weather.list[0].main.temp));
        },
        dayTemp:function(){
            let arr = [];
            for (let i = 0; i < 8; i++) {
                arr.push( Math.round(this.temperatureConverter(this.weather.list[i].main.temp)));
            }
            return arr;
        },
        weektemp:function(){
            let arr = this.avgTemp;
            return arr.slice(1);;
        },
        weekIcon:function(){
            let arr = [];
            for (let i = 8; i < this.weather.list.length; i+=8) {
                arr.push("http://openweathermap.org/img/wn/"+this.weather.list[i].weather[0].icon+"@2x.png");
            }
            return arr;
        },
        getweekArr:function(){
            let arr = [];
            arr.push("Sunday");
            arr.push("Monday");
            arr.push("Tuesday");
            arr.push("Wednesday");
            arr.push("Thursday");
            arr.push("Friday");
            arr.push("Saturday");
            return arr;
        },
        
        chartWeek:function(){
            let arr = this.getweekArr;
            var d = new Date();
            var n = d.getDay();
            let arr2 =[];
            for (let i = 0; i <= 4 ; i++) {
                arr2.push(arr[(n+i) % 7]);
            }
            return arr2;
        },
       
        
        fourDayes:function(){
            let arr = this.getweekArr;
            var d = new Date();
            var n = d.getDay();
            let arr2 =[];
            for (let i = 1; i <= 4 ; i++) {
                arr2.push(arr[(n+i) % 7]);
            }
            
            return arr2;
        },
        avgTemp:function(){
            let sum = 0 ;
            let avg = 0;
            let arr = [];
            for (let i = 0; i < this.weather.list.length; i++) {
                sum += this.weather.list[i].main.temp;
                if((i+1) % 8 == 0 ){
                    avg = Math.round(this.temperatureConverter(sum / 8)) ;
                    arr.push(avg);
                    sum = 0;
                }
            }
            return arr;
        },
        avgHumid:function(){
            let sum = 0 ;
            let avg = 0;
            let arr = [];
            for (let i = 0; i < this.weather.list.length; i++) {
                sum += this.weather.list[i].main.humidity;
                if((i+1) % 8 == 0 ){
                    avg = sum / 8 ;
                    arr.push(avg);
                    sum = 0;
                }
            }
            return arr;
        },
        avgSpeed:function(){
            let sum = 0 ;
            let avg = 0;
            let arr = [];
            for (let i = 0; i < this.weather.list.length; i++) {
                sum += this.weather.list[i].wind.speed;
                if((i+1) % 8 == 0 ){
                    avg = ((sum / 8)*18)/5 ;
                    arr.push(avg);
                    sum = 0;
                }
            }
            return arr;
        },

    },
    created: function() {
       
    },
    mounted() {
        this.cityName = 'Amsterdam';  
        this.init();
    }
});