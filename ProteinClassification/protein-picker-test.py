import unittest
import protein-picker

class MyTest(unittest.TestCase):
    def test(self):
        proteinPicker = new ProteinPicker()
        path = '/Users/sircrashalot/Documents/school/thesis/proteins/'
        self.assertEqual(proteinPicker.nextProtein(path), 4)

    def some_test(self):
        #do something