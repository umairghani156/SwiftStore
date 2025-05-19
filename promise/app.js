
// Promise.all uses


// function delay(min){
//     return new Promise(resolve => setTimeout(resolve, min))
// }

// const delay1 = delay(1000);
// const delay2 =delay(2000);

// const p1 = new Promise((resolve)=> {
//     setTimeout(() => {
//         resolve("Promise one Resolved")
//     }, 100);
// });

// const p2 = new Promise((_, rejected)=>{
//     setTimeout(() => {
//         rejected("Promise two rejected")
//     }, 500);
// });

// const p3 = new Promise((resolve)=>{
//     setTimeout(()=>{
//         resolve('Promise three resolved')
//     }, 1500)
// })

// Promise.all([p1, p2, p3]).then(()=>{
//     console.log("Hello")
// }).catch((error)=>{
//     console.log("Promise ", error)
// })

// Promise.allSettled([p1, p2, p3]).then((results)=>{
//     console.log("Results", results)
//     results.forEach((val, index)=>{
//         if(val.status === 'fulfilled'){
//             console.log(`Promise ${index + 1} succeeded with`, val.value)
//         }else {
//             console.warn(`Promise ${index + 1} failed with `, val.reason)
//         }
//     })
// })


// function recursionCall(n){
//     if(n >= 5) return
//     console.log(n)
//     recursionCall(n + 1)
// }

// recursionCall(0)


// {
//     var x = 10;
//     let y = 20;
//     const z = 40;
// }
// console.log("check", x)


// function hello(...greeting){
//     console.log(...greeting, this.name)
// }

// const Person = {
//     name: "John",
// }


// hello.call(Person, ["hello","world","ather"])

// const person = {
//     name: "Umair",
//     helloWay: function (name){
//         console.log(name, this.name)
//     }
// }

// const person2 = {
//     name: 'Ahmed'
// }

// const h =person.helloWay.bind(person2)
// h("Hello")

