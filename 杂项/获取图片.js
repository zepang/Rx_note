/**
 * URL.createObjectURL()方法会根据传入的参数创建一个指向该参数对象的URL. 这个URL的生命仅存在于它被创建的这个文档里. 新的对象URL指向执行的File对象或者是Blob对象.
 * 
 * URL.revokeObjectURL()方法会释放一个通过URL.createObjectURL()创建的对象URL. 当你要已经用过了这个对象URL,然后要让浏览器知道这个URL已经不再需要指向对应的文件的时候,就需要调用这个方法.

具体的意思就是说,一个对象URL,使用这个url是可以访问到指定的文件的,但是我可能只需要访问一次,一旦已经访问到了,这个对象URL就不再需要了,就被释放掉,被释放掉以后,这个对象URL就不再指向指定的文件了.

比如一张图片,我创建了一个对象URL,然后通过这个对象URL,我页面里加载了这张图.既然已经被加载,并且不需要再次加载这张图,那我就把这个对象URL释放,然后这个URL就不再指向这张图了.
 * 
 * 注意点:

每次调用createObjectURL的时候,一个新的URL对象就被创建了.即使你已经为同一个文件创建过一个URL. 如果你不再需要这个对象,要释放它,需要使用URL.revokeObjectURL()方法. 当页面被关闭,浏览器会自动释放它,但是为了最佳性能和内存使用,当确保不再用得到它的时候,就应该释放它.
 */
document.getElementById('getPic').onclick = function(e){
        $.ajax({
          type:'GET',
          url:'img.png',
          resDataType:'blob',
          imgType:'png',
          success:function(resText,resXML){
            var img = document.createElement('img');
            var objectUrl = window.URL.createObjectURL(resText);
            img.src = objectUrl;
            img.onload = function(){
              window.URL.revokeObjectURL(objectUrl);
            };
            document.body.appendChild(img);
          },
          fail:function(err){
            console.log(err)
          }
        });
        e.preventDefault();
      }