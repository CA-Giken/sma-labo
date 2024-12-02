# sma-labo/study-01
## ステレオカメラの実験  

1. 起動 
~~~
roslaunch sma-labo 01.launch
~~~
2. 梅の花キャリブ板を動かす  
- RvizのDisplayから、Interactive Markerの表示を有効にする。
- カーソルでキャリブ板を動かす

3. カメラ画像を保存  
カメラシミュレータが発行する、Imageトピックを画像ファイルに保存する。
~~~
./imsave.py
~~~
PNGファイルimage_left、image_right、および座標値がpose.yamlに保存される。
