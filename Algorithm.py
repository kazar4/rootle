import random
import numpy as np


def MinMaxScaler(data):
    """Min Max normalizer.

    Args:
      - data: original data

    Returns:
      - norm_data: normalized data
    """
    numerator = data - np.min(data, 0)
    denominator = np.max(data, 0) - np.min(data, 0)
    norm_data = numerator / (denominator + 1e-7)
    return norm_data


def order(bins, bin_size, n):
    """Algorithm to order ids of businesses.

    Args:
      - bins: list of numpy arrays of ids
      - bin_size: number of bins
      - n: number of businesses

    Returns:
      - ordered: ordered list of ids
    """
    choices = range(bin_size)
    dist = [(bin_size - choice) ** 2 for choice in choices]
    count = 0
    ordered = list()
    while count < n:
        random_bin = random.choices(population=choices, weights=dist)[0]
        bn = bins[random_bin]
        if bn is not None and len(bn) != 0:
            elt = bn.item(0)
            ordered.append(elt)
            bins[random_bin] = np.delete(bn, 0)
            count += 1
    return ordered


def reorder(num_list, id_list, n):
    """Reorderer of list of businesses to promote lower values.

    Args:
      - num_list: list of business' number of reviews
      - id_list: list of business' ids
      - size: number of businesses

    Returns:
      - result: reordered list of ids
    """
    nums = np.array(num_list)
    ids = np.array(id_list, dtype=object)

    bin_size = max(n // 15, 1)

    scaled = MinMaxScaler(nums)

    bins = list()
    bn = ids[scaled <= (1 / bin_size)]
    np.random.shuffle(bn)
    bins.append(bn)
    for i in range(1, bin_size):
        bn = ids[((i / bin_size) < scaled) & (scaled <= ((i + 1) / bin_size))]
        np.random.shuffle(bn)
        bins.append(bn)

    result = order(bins, bin_size, n)

    return result