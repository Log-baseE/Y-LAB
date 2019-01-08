# INSTRUKSI UNTUK LINUX

## Catatan

### Log pekerjaan

- Struktur ulang program Python agar developer friendly
- Fix masalah codec untuk write ke video .mp4:

    Sebelumnya, masing-masing frame dari opencv langsung ditulis ke video `.mp4`. Untuk menghindari masalah codec opencv, hasil masing-masing frame diwrite ke `.avi` terlebih dahulu. Lalu, temporary video tersebut diconvert menjadi `.mp4` dengan menggunakan `ffmpeg`.
- Perubahan algoritma untuk `remove_overlaps`, agar lebih akurat. Untuk video `sample video cars.mp4`, hasil counting car menjadi **54**.
- Update UI agar traffic dan custom ROI dapat diinput
- Instalasi tambahan:
    - library `ffmpeg-python` untuk program python:
        ```sh
        (yolo-venv) $ pip install ffmpeg-python
        ```
    - package `ffmpeg` di OS:
        ```sh
        apt install ffmpeg
        ```

## Troubleshooting

### Video .mp4 tidak muncul saat diupload:

#### Video terlalu besar, sehingga terlalu lama untuk diload:
    
Hindari penggunaan video lebih dari 75 MB.

#### Codec .mp4 tidak bekerja.

Agar video dapat ditampilkan, run file `videodetector.py` di dalam folder `DeepLearning_tool` dengan menjalankan:

```sh
$ source activate yolo-venv

(yolo-venv) $ python videodetector.py

# Ikuti prompt yang diminta oleh program
```