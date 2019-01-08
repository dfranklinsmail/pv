import unittest
from proteinPicker import ProteinPicker

class MyTest(unittest.TestCase):
    def test(self):
        proteinPicker = ProteinPicker()
        path = '/Users/sircrashalot/Documents/school/thesis/proteins/'
        nextProtein = proteinPicker.findNextProtein(path)
        print(nextProtein)

if __name__ == '__main__':
    unittest.main()