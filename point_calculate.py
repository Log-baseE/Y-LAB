def boxDistance(x1, y1, x2, y2):
    return abs(x1-x2)

def isNormalBlobSize(x1, y1, x2, y2):
    if abs(x1-x2) > 300:
        return False
    else:
        return True

def AABB(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2):
    if(ax1 < bx2 and ax2 > bx1 and ay1 < by2 and ay2 > by1):
        return True

# def detect(tfnet, imgcv, roi, calc):
#     counter = [0, 0, 0, 0, 0]
#     coord = []
#     h, w, _ = imgcv.shape
#     masked = getROI(imgcv)

#     if roi:
#         # jika ingin hasil hanya di Region of Interest maka roi=true
#         result = tfnet.return_predict(masked)
#     else:
#         result = tfnet.return_predict(imgcv)  # hasil seluruh gambar
#         # https://github.com/thtrieu/darkflow
#     for bbox in result:
#         left, top, right, bot, label = bbox['topleft']['x'], bbox['topleft'][
#             'y'], bbox['bottomright']['x'], bbox['bottomright']['y'], bbox['label']
#         if label != "car" and label != "truck":
#             continue
#         if isNormalBlobSize(left, top, right, bot):
#             # catat semua kordinat deteksi
#             coord.append((left, top, right, bot))

#     # Bersihkan kordinat-kordinat boundingbox yang menempel
#     if(len(coord) > 1):
#         pointB = coord[0]
#         for item in coord[1:]:
#             pointA = pointB
#             pointB = item
#             # detection threshold = batas selisih pixel yang dibutuhkan sehingga 2 box dianggap mendeteksi hal yang sama
#             if(boxDistance(pointA[0], pointA[1], pointB[0], pointB[1]) < DETECTION_THRESHOLD):
#                 # jika THRESHOLD=10, maka jika ada 2 box berjarak dibawah 10 pixel , salah satunya akan dihapus
#                 coord.remove(item)

#     for coordinate in coord:
#         # gambar box dari koordinat yang valid (sudah dibersihkan dari deteksi ganda
#         cv2.rectangle(
#             imgcv, (coordinate[0], coordinate[1]), (coordinate[2], coordinate[3]), 255, 3)
#         # beri label car
#         cv2.putText(
#             imgcv, "car", (coordinate[0], coordinate[1]-12), 0, 2e-3*h, 255, 1)
#         # jika ada collision dengan garis hitung
#         if AABB(coordinate[0], coordinate[1], coordinate[2], coordinate[3], 1150, 380, 1230, 390) and calc[0]:
#             counter[0] = 1
#         # jika ada collision dengan garis hitung
#         if AABB(coordinate[0], coordinate[1], coordinate[2], coordinate[3], 840, 380, 940, 390) and calc[1]:
#             counter[1] = 1
#             cv2.line(imgcv, (180, 170), (320, 170),
#                      (0, 255, 0))  # ROI Line GMM Dataset
#         # jika ada collision dengan garis hitung
#         if AABB(coordinate[0], coordinate[1], coordinate[2], coordinate[3], 655, 370, 740, 390) and calc[2]:
#             counter[2] = 1
#             cv2.line(imgcv, (180, 170), (320, 170),
#                      (0, 255, 0))  # ROI Line GMM Dataset
#         # jika ada collision dengan garis hitung
#         if AABB(coordinate[0], coordinate[1], coordinate[2], coordinate[3], 450, 380, 550, 390) and calc[3]:
#             counter[3] = 1
#         # jika ada collision dengan garis hitung
#         if AABB(coordinate[0], coordinate[1], coordinate[2], coordinate[3], 270, 380, 340, 390) and calc[4]:
#             counter[4] = 1
#     return imgcv, counter