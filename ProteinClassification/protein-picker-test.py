import unittest
#import protein-picker
from proteinPicker import ProteinPicker

class MyTest(unittest.TestCase):
    def test_next_protein(self):
        print('testing find next protein')
        pp = ProteinPicker()

        path = '/Users/sircrashalot/Documents/school/thesis/proteins/'
        self.assertEqual(pp.findNextProtein(path), 4)

if __name__ == '__main__':
    unittest.main()