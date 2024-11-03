from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        nickname = attrs.get("nickname")
        if nickname:
            attrs['email'] = nickname
        return super().validate(attrs)
