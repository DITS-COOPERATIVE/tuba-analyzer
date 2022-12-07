from django.urls import path
from django.http import HttpResponse
import pickle
import os
from rest_framework.decorators import api_view

@api_view(['POST'])
def process(request):
  data = request.data

  return HttpResponse(main(data['ph'], data['av'], data['tb']))

def main(ph, av, tb):

    dirname = os.path.dirname(__file__)
    filename = os.path.join(dirname, 'finalized_model.sav')

    features = [[ph, av, tb]]

    loaded_model = pickle.load(open(filename, 'rb'))

    return classify(loaded_model.predict(features)[0])


def classify(result):
    if result == 0:
        return "Bahal"
    elif result == 1:
        return "Bahalina"
    elif result == 2:
        return "Vinegar"
    else:
        return None


urlpatterns = [
    path('process', process)
]
