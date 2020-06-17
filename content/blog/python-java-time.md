---
date: "2020-05-14T21:01:11+08:00"
title: "Java 和 Python 中的时间"
tags:
  - Python
  - Java
---

在平时的工作中免不了需要和各种时间打交道。这里整理一下 Java 和 Python 中关于时间的概念和用法。

<!--more-->

### 时间的表示

早期由于计算机内存和存储介质的限制，会用 6 位数字来存储时间，即年、月、日各两位。因此当一个世纪过去的时候就会出现「千年虫」的问题，比如没有办法分辨 2000 年和 1900 年。

现在一般采用时间戳来表示时间。比如：

- `Wed 01-01-2009 6:00`
- `Sat Jul 23 02:16:57 2005`
- `2005-10-30 T 10:45 UTC`

其实实际上就是通过各个部分表示日期、时间（或带上时区），然后连接起来。UNIX 时间比较特殊，是从 UTC1970 年 1 月 1 日 0 时 0 分 0 秒起至现在的总秒数。对于同一个时刻，UNIX 时间肯定是相同的；对于世界不同时区相同的当地时间，对应的 UNIX 时间是不同的。

### 日期、时间和时区

UNIX 时间适合计算但是并不容易被人理解，也很难计算出和系统当地时区相关的时刻：比如，想要从一个 UNIX 时间戳得到这天开始的时间戳。因此一般的语音都提供了一套时间处理的内置方法。

先不考虑时区，实际上我们用的最多的就是系统当地的日期和时间，因此一般来说掌握这个日期时间和 UNIX 时间戳的转换，其实已经满足大部分的需要。

#### Python datetime

[`datetime`](https://docs.python.org/zh-cn/3/library/datetime.html#module-datetime) 提供用于处理日期和时间的类。

- `date` 日期
- `time` 时间
- `datetime` 日期和时间的组合
- `timedelta` 时间差

```python
from datetime import date, datetime
d1 = date.today() # 今天的日期 2020-05-14
d2 = date.fromisoformat('2020-05-12') # 从 YYYY-MM-DD 构造日期
print((d2-d1).days)
# -> 2
dt = datetime(d1.year,d1.month,d1.day) # 今天 0 点的日期时间，因为其他默认为0
```

以上都是简单型的数据类型，如果需要时区信息，则要构造相应的 `tzinfo`。

#### Java java.time

首先都不应该继续使用 `java.util.Date` 或者 `java.util.Calendar`，两个的设计都有问题。而 `java.time` 可以得到和 Python 时间处理一样的体验。在低版本（<1.8）的 Java 上，可以使用 `Joda-Time` ，接口是一样的。而 Android 在 API level 26 也已经加入了这个包，所以在面向 Android 8.0 的以上版本系统的应用，都是可以使用的。

其中提供的类型包括：

- `Instant` - 时间戳
- `LocalDate` - 当前日期，类似 2010-12-03
- `LocalTime` - 当前时间，类似 11:30
- `LocalDateTime` - 当前日期时间，类似 2010-12-03T11:30
- `ZonedDateTime` - 日期时间加上时区信息，尽量使用上面没有时区的当前时间

是不是和上面的很类似，只不过加了一个 `Local/Zoned` 来区别是否带有时区信息。

```java
// 当前的一些量 2020-01-08 晚上的测试 结果
LocalDateTime now = LocalDateTime.now();
System.out.println(now); // 2020-01-08T19:42:24.745
System.out.println(now.getDayOfMonth()); // 8
System.out.println(now.getDayOfWeek());  // WEDNESDAY
System.out.println(now.getHour());       // 19
System.out.println(now.getMinute());     // 42
System.out.println(now.getSecond());     // 24
// 获取当前时间戳
Instant instant = Instant.now();
System.out.println(instant.getEpochSecond()); // 1578483744
```

同样，获取某天开始的时间戳可以这样写：

```java
// 当天的开始的时间戳，这里就要考虑时区
ZoneId z = ZoneId.of("Asia/Shanghai");
System.out.println(LocalDate.now().atStartOfDay(z).toEpochSecond());
// 1578412800
```

需要进行时间的格式化和解析，也很简单：

```java
// 格式化
public static String formatDate(long eventTime) {
    LocalDateTime localDateTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(eventTime),
    ZoneId.systemDefault());
    DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd
HH:mm:ss");
    return localDateTime.format(dateTimeFormatter);
}
// 解析
public static long parseDate(String timeStr) {
    DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd
HH:mm:ss");
    LocalDateTime parsedDateTime = LocalDateTime.parse(timeStr, dateTimeFormatter);
    ZonedDateTime zonedDateTime = ZonedDateTime.of(parsedDateTime,ZoneId.systemDefault());
    return zonedDateTime.toInstant().toEpochMilli();
}
```

{{< notice info >}}
Android Studio 4.0 现在可以支持任意 API level 的 Java 8 Desugaring
{{< /notice >}}
