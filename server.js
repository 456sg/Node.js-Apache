let http=require("http");
let fs=require("fs");
let path=require("path");
let mime = require('mime');
let querystring=require('querystring');
let rootPath=path.join(__dirname,"www");//获取当前目录并拼接www，形成存放文件的跟目录

//开启服务器
http.createServer(function (request,response) {  
    let filePath=path.join(rootPath,querystring.unescape(request.url));//根据请求的文件名，拼接成一个请求的文件的完整的绝对路径。为后续读文件提供路径url。
    if(fs.existsSync(filePath)){//判断请求文件生成的路径 是否存在
        //存在
        fs.readdir(filePath,(err,files)=>{//判断请求文件生成的路径 是否为目录
            if(err){//进到这里则表示请求文件生成的路径 为文件
                fs.readFile(filePath,(err,data)=>{
                    if(err){
                        console.log(err);
                    }else{
                        response.writeHead(200,{"content-type":mime.getType(filePath)});//手动设置200及文件类型
                        response.end(data);//停止响应，返回结果
                    }
                })
            }else{//这表示请求文件生成的路径 为目录
                if(files.indexOf("index.html")!=-1){//判断目录中是否含有index.html页面
                    //有 则读取index.html页面
                    fs.readFile(path.join(filePath,"index.html"),(err,data)=>{
                        if(err){
                            console.log(err);
                        }else{
                            response.writeHead(200,{"content-type":mime.getType(filePath)});//手动设置200及文件类型
                            response.end(data);//停止响应，返回结果
                            // return;
                        }
                    })
                }else{//无 循环files 返回html文件
                    let backData="";
                    for(let i=0;i<files.length;i++){
                        backData+=`<h2><a href="${request.url=="/"?"":request.url}/${files[i]}">${files[i]}</a></h2>`
                    }
                    response.writeHead(200,{"content-type":"text/html;charset=utf-8"});//手动设置200及文件类型
                    response.end(backData);
                }
            }
        })
    }else{//不存在
        response.writeHead(404,{"content-type":"text/html;charset=utf-8"});//手动设置404及文件类型
        response.end('<h2>404</h2>');//停止响应，返回结果
    }

}).listen(4560,"127.0.0.1",function () {  
    console.log("监听成功！");
})