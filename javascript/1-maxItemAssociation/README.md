# About

1-maxItemAssociation

# Description

Написать функцию maxItemAssociation(), получающую исторические данные покупок пользователей и возвращающую максимальный список рекомендаций.

Входные данные - массив исторических покупок пользователей `[["a", "b"], ["a", "c"], ["d", "e"]]`. То есть 

Пользователь 1 купил "a" и "b". 

Пользователь 2 купил продукты "a", "c". 

Пользователь 3 купил продукты "d", "e".


Надо найти максимальную группу рекомендаций. 

Группа рекомендаций - это продукты, которые был куплены другими пользователями при условии, если они пересекаются с исходным списком.

Если количество рекомендаций в группах одинаковое - вернуть первую группу, из отсортированных в лексикографическом порядке.

Решение:
```
Группа рекомендаций 1 - ["a", "b", "c"]. 

Покупка "a" содержится в списке 2, поэтому весь список 2 может быть добавлен в рекомендации.

Группа рекомендаций 2 - ["d", "e"].
```
```
Ответ: ["a", "b", "c"].
```

Пример 2:
```
Входные данные: [
["q", "w", 'a'],
["a", "b"],
["a", "c"],
["q", "e"],
["q", "r"],
]
```
```
Ответ ["a", "b", "c", "e", "q", "r", "w"] - это максимальная по пересечениям группа. Можно видеть, что первый массив пересекается со всеми остальными, и 
потому результат является всем множеством значений.
```

# Ресурсы:


https://akshanshweb.files.wordpress.com/2018/04/screenshot-from-2018-04-21-10-06-12.png?w=720

https://dzone.com/articles/machinex-understanding-fp-tree-construction

https://www.softwaretestinghelp.com/fp-growth-algorithm-data-mining/

https://www.mygreatlearning.com/blog/understanding-fp-growth-algorithm/

https://zims-en.kiwix.campusafrica.gos.orange.com/wikibooks_en_all_maxi/A/Data_Mining_Algorithms_[…]/Frequent_Pattern_Mining/The_FP-Growth_Algorithm


# How to

```
yarn install
```

```
yarn test
```