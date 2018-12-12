import math
import cv2

def boxDistance(x1, y1, x2, y2):
    # return abs(x1-x2)
    return math.sqrt((x1-x2)**2+(y1-y2)**2)

def isNormalBlobSize(x1, y1, x2, y2):
    if abs(x1-x2) > 300:
        return False
    else:
        return True

def AABB(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2):
    if(ax1 < bx2 and ax2 > bx1 and ay1 < by2 and ay2 > by1):
        return True

def collision(left, top, right, bot, line, is_vertical):
    line_x, line_y = get_point((left+right)/2, (top+bot)/2, line)
    if is_vertical:
        return ((line_y > top) & (line_y < bot))
    else:
        return ((line_x > left) & (line_x < right))

def collision_debug(left, top, right, bot, line, is_vertical, img, i):
    print("Frame coll: " + str(i))
    line_x, line_y = get_point((left+right)/2, (top+bot)/2, line)
    cv2.line(img, (int(line[0][0]), int(line[0][1])), (int(line[1][0]), int(line[1][1])), (0, 255, 0))
    cv2.circle(img, (int((left+right)/2), int(line_y)), 5, (0,0,255), -1)
    if is_vertical:
        coll = ((line_y > top) & (line_y < bot))
    else:
        coll = ((line_x > left) & (line_x < right))
    cv2.rectangle(img, (int(left), int(top)), (int(right), int(bot)), 255, 3)
    cv2.putText(
                img,
                'Detected Vehicles: ' + str(coll),
                (10, 35),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 0xFF, 0xFF),
                2,
                cv2.FONT_HERSHEY_SIMPLEX,
                )
    cv2.imwrite("./temp_results/point_" + str(i) + ".jpg", img)
    return coll

def get_point(x, y, line):
    x1, y1 = line[0][0], line[0][1]
    x2, y2 = line[1][0], line[1][1]
    if x1 == x2:
        # counting line is vertical
        return(x1, y)
    else:
        if y1 == y2:
            # counting line is horizontal
            return(x, y1)
        else:
            # get point from line equation
            point_y = ((x*y2) - (x*y1) - (x1*y2)  + (y1*x2)) / (x2-x1)
            point_x = ((y*x2 - y*x1 - y1*x2 + x1*y2)) / (y2-y1)
            return (point_x, point_y)
