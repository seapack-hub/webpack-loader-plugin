//引入Mustacha
// import mustache from "mustache/mustache.js";
//window.Mustache = mustache

import Mustache from "./Mustache";
window.Mustache = Mustache;

let template =
`<ul>
   {{#arr}}
    <li>
       <div>{{name}}的基本信息</div>
       <div>
          <p>姓名：{{name}}</p>
          <p>性别：{{sex}}</p>
          <p>年龄：{{age}}</p>
          <p>爱好：{{#arr.hobbies}}<span>{{name}}、</span>{{/arr.hobbies}}</p>
       </div>
     </li>
   {{/arr}}
</ul>`;
let data = {
    // title: "Joe",
    // calc: function () {
    //     return 2 + 4;
    // },
    arr:[
        { name: "小王",sex: "男",age: 18,
            hobbies:[
                {name:"篮球"},
                {name:"羽毛球"}
            ]
        },
        { name: "小明",sex: "男",age: 25,
            hobbies: [
                {name:"王者荣耀"},
                {name:"决斗连接"}
            ]
        },
        { name: "小刘",sex: "男",age: 30,
            hobbies: [
                {name:"冲浪"},
                {name:"滑雪"}
            ]
        }
    ]

};
// mustache.render(template,data);

let text = new Mustache(template,data);
